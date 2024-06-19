const font = "Larry 3D";
const root = '~';
let cwd = root;
const user = 'guest';
const server = 'freecodecamp.org';

function prompt() {
    return `[[;#44D544;]${user}@${server}]:[[;blue;]${cwd}$] `;
}

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

const commands = {
  help() {
    term.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    if (args.length > 0) {
        term.echo(`[[;white;]${args.join(' ')}]`);
    }
  },
  cd(dir = null) {
    if (dir === null || (dir === '..' && cwd !== root)) {
        cwd = root;
    } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
        cwd = dir;
    } else if (dirs.includes(dir)) {
        cwd = root + '/' + dir;
    } else {
        this.error('Wrong directory');
    }
}
};

const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => {
  return `[[;white;]${cmd}]`;
});

const help = formatter.format(formatted_list);
const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false,
  completion: true,
  prompt
});

const re = new RegExp(`^\s*(${command_list.join('|')}) (.*)`);

const directories = {
  education: [
      '',
      '[[;white;]education]',

      '* <a href="https://en.wikipedia.org/wiki/Kielce_University_of_Technology">Kielce University of Technology</a> [[;yellow;]"Computer Science" 2002-2007 / 2011-2014]',
      '* <a href="https://pl.wikipedia.org/wiki/Szko%C5%82a_policealna">Post-secondary</a> Electronic School [[;yellow;]"Computer Systems" 2000-2002]',
      '* Electronic <a href="https://en.wikipedia.org/wiki/Technikum_(Polish_education)">Technikum</a> with major [[;yellow;]"RTV" 1995-2000]',
      ''
  ],
  projects: [
      '',
      '[[;white;]Open Source projects]',
      [
          ['jQuery Terminal',
           'https://terminal.jcubic.pl',
           'library that adds terminal interface to websites'
          ],
          ['LIPS Scheme',
           'https://lips.js.org',
           'Scheme implementation in JavaScript'
          ],
          ['Sysend.js',
           'https://jcu.bi/sysend',
           'Communication between open tabs'
          ],
          ['Wayne',
           'https://jcu.bi/wayne',
           'Pure in browser HTTP requests'
          ],
      ].map(([name, url, description = '']) => {
          return `* <a href="${url}">${name}</a> &mdash; [[;white;]${description}]`;
      }),
      ''
  ].flat(),
  skills: [
      '',
      '[[;white;]languages]',

      [
          'JavaScript',
          'TypeScript',
          'Python',
          'SQL',
          'PHP',
          'Bash'
      ].map(lang => `* [[;yellow;]${lang}]`),
      '',
      '[[;white;]libraries]',
      [
          'React.js',
          'Redux',
          'Jest',
      ].map(lib => `* [[;green;]${lib}]`),
      '',
      '[[;white;]tools]',
      [
          'Docker',
          'git',
          'GNU/Linux'
      ].map(lib => `* [[;blue;]${lib}]`),
      ''
  ].flat()
};

// Colors and renders
function render(text) {
  const cols = term.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true,
  });
}

function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function ready() {
  const seed = rand(256);
  term.echo(() => rainbow(render('Terminal Portfolio'), seed))
  .echo('[[;white;]Welcome to my Terminal Portfolio]').resume();
}

function rainbow(string, seed) {
  return lolcat.rainbow(function(char, color) {
    char = $.terminal.escape_brackets(char);
    return `[[;${hex(color)};]${char}]`;
  }, string, seed).join('\n');
}

function hex(color) {
  return (
    "#" +
    [color.red, color.green, color.blue]
    .map((n) => {
      return n.toString(16).padStart(2, "0");
    })
    .join("")
  );
}

$.terminal.new_formatter(function(string) {
    return string.replace(re, function(_, command, args) {
        return `[[;white;]${command}] [[;aqua;]${args}]`;
    });
});