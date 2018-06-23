const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const gulp = require('gulp');
const { argv } = require('yargs');
const mocha = require('gulp-mocha');
const replace = require('gulp-replace');
const gap = require('gulp-append-prepend');
const prompt = require('prompt');
const chalk = require('chalk');

const signale = require('signale');
signale.config({
    displayTimestamp: true,
});

gulp.task('test', () => {
    return gulp.src('test/*.js', { read: false })
        .pipe(mocha({
            require: ['ts-node/register'],
        }));
});

// git checkout dev
// gulp release --tag x.y.z
gulp.task('release', ['test', 'changelog'], async () => {
    const tag = argv.tag;
    await execFile('npm', ['version', '--no-git-tag-version', tag]);
    await execFile('git', ['add', 'CHANGELOG.md', 'package.json', 'package-lock.json']);
    await execFile('git', ['commit', '-m', `v${tag}`]);
    signale.info(`Made a commit v${tag}`);

    await execFile('git', ['checkout', '-b', `release/${tag}`]);
    signale.info(`Branch release/${tag} created`);

    await execFile('tsc');
    await run(gulp.src(['dist/**/*']).pipe(gulp.dest('lib')));
    await execFile('git', ['add', 'lib']);
    signale.info('Sources are transpiled to lib directory');

    await execFile('git', ['commit', '-m', `v${tag}`]);
    await execFile('git', ['tag', `v${tag}`]);
    signale.info(`Tagged v${tag}`);

    return new Promise((resolve) => {
        prompt.start({ message: 'Are you ready to publishing?' });
        prompt.confirm('yes/no', function(err, result) {
            if (result) {
                publish(tag);
            } else {
                console.log('You can execute this command later: ' + chalk.yellow(`gulp publish --tag ${tag}`));
            }
            resolve();
        });
    });
});

gulp.task('changelog', () => {
    const date = new Date().toLocaleDateString('en-EN', { day: 'numeric', year: 'numeric', month: 'long' });
    return gulp.src('CHANGELOG.md')
        .pipe(replace('## [Unreleased]', `## ${argv.tag} (${date})`))
        .pipe(gulp.dest('.'));
});

// gulp publish --tag x.y.z
gulp.task('publish', () => {
    publish(argv.tag);
});

async function publish(tag) {
    signale.await('Publishing to NPM');
    await execFile('npm', ['publish']);
    signale.info('Published to NPM');

    await execFile('git', ['checkout', 'master']);
    await execFile('git', ['merge', 'dev', '--no-ff', '-m', `v${tag}`]);
    signale.await('Publishing to github');
    await execFile('git', ['push', 'origin', 'master', 'dev', `refs/tags/v${tag}`]);
    signale.info(`Published a master and dev branches along with tag v${tag} to github`);

    await execFile('rm', ['-rf', 'lib']);
    signale.info('Directory lib removed');

    await execFile('git', ['branch', '-D', `release/${tag}`]);
    signale.info(`Branch release/${tag} removed`);

    await run(
        gulp.src('CHANGELOG.md')
            .pipe(gap.prependText('## [Unreleased]', '\n\n'))
            .pipe(gulp.dest('.'))
    );
    signale.success('Release published!');
    signale.star('Please copy changelog to release description:');
    signale.star(chalk.yellow.underline(`https://github.com/tenorok/botist/releases/tag/v${tag}`));
}

function run(pipe) {
    return new Promise(function(resolve, reject) {
        pipe
            .on('error', reject)
            .on('end', resolve);
    });
}
