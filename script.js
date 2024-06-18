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
      term.echo(args.join(' '));
  }
};

const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => {
  return `<white class="command">${cmd}</white>`;
});

const help = formatter.format(formatted_list);
const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false
});

term.on('click', '.command', function() {
  const command = $(this).text();
  term.exec(command);
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
     .echo('Welcome to my Terminal Portfolio\n').resume();
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
