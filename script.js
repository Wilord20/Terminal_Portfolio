const font = "Larry 3D";
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
  exit: false
});

const re = new RegExp(`^\s*(${command_list.join('|')}) (.*)`);

$.terminal.new_formatter(function(string) {
    return string.replace(re, function(_, command, args) {
        return `[[;white;]${command}] [[;aqua;]${args}]`;
    });
});


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
