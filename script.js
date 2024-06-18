const font = "Larry 3D";

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

const commands = {};

const term = $("body").terminal(commands, {
  greetings: false,
});

function ready() {
  term.echo(() => {
    const ascii = render("Terminal Portfolio");
    return `${ascii}\nWelcome to my Terminal Portfolio\n`;
  });
}

function render(text) {
  const cols = term.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true,
  });
}

$(function () {
  $("body").terminal({
    // La funcion 'hello' requiere de una variable, en este caso 'what'
    hello: function (what) {
      this.echo("[[b;red;white]Hello, " + what + ". Welcome to this terminal.");
    },
    // Aquí 'cat' es una funcion que no necesita de una variable y solo regresará una imagen
    cat: function (width, height) {
      const img = $(
        '<img src="https://placekitten.com/' + width + "/" + height + '">',
        { raw: true }
      );
      // Añadimos un load y pause en caso de conexiones lentas
      img.on("load", this.resume);
      this.pause();
      this.echo(img);
    },
  });
});
