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
const help = formatter.format(command_list);

const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false
});

function ready() {
  term
    .echo(() => rainbow(render("Terminal Portfolio")))
    .echo('<white>Welcome to my Terminal Portfolio</white>\n')
    .resume();
}

function render(text) {
  const cols = term.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true,
  });
}

function rainbow(string) {
  return lolcat
    .rainbow(function (char, color) {
      char = $.terminal.escape_brackets(char);
      return `[[;${hex(color)};]${char}]`;
    }, string)
    .join("\n");
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
