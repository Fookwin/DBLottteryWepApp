const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'dblottery-ssq', shell: true };
require('child_process').spawn('npm', args, opts);