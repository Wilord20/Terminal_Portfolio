const font = "Larry 3D";
const root = "~";
let cwd = root;
const user = "guest";
const server = "linkedin.org";
const url = "https://v2.jokeapi.dev/joke/Programming";

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const directories = {
  education: [
    "",
    "<white>education</white>",

    '* <a href="https://en.wikipedia.org/wiki/Kielce_University_of_Technology">Kielce University of Technology</a> <yellow>"Computer Science"</yellow> 2002-2007 / 2011-2014',
    '* <a href="https://pl.wikipedia.org/wiki/Szko%C5%82a_policealna">Post-secondary</a> Electronic School <yellow>"Computer Systems"</yellow> 2000-2002',
    '* Electronic <a href="https://en.wikipedia.org/wiki/Technikum_(Polish_education)">Technikum</a> with major <yellow>"RTV"</yellow> 1995-2000',
    "",
  ],
  projects: [
    "",
    "<white>Open Source projects</white>",
    [
      [
        "jQuery Terminal",
        "https://terminal.jcubic.pl",
        "library that adds terminal interface to websites",
      ],
      [
        "LIPS Scheme",
        "https://lips.js.org",
        "Scheme implementation in JavaScript",
      ],
      ["Sysend.js", "https://jcu.bi/sysend", "Communication between open tabs"],
      ["Wayne", "https://jcu.bi/wayne", "Pure in browser HTTP requests"],
    ].map(([name, url, description = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
  ].flat(),
  skills: [
    "",
    "<white>languages</white>",

    ["JavaScript", "TypeScript", "Python", "SQL", "PHP", "Bash"].map(
      (lang) => `* <yellow>${lang}</yellow>`
    ),
    "",
    "<white>libraries</white>",
    ["React.js", "Redux", "Jest"].map((lib) => `* <green>${lib}</green>`),
    "",
    "<white>tools</white>",
    ["Docker", "git", "GNU/Linux"].map((lib) => `* <blue>${lib}</blue>`),
    "",
  ].flat(),
};

const dirs = Object.keys(directories);

function print_dirs() {
  term.echo(
    dirs
      .map((dir) => {
        return `<blue class="directory">${dir}</blue>`;
      })
      .join("\n")
  );
}

const commands = {
  help() {
    term.echo(`List of available commands: ${help}`);
  },
  echo(...args) {
    if (args.length > 0) {
      term.echo(`<white>${args.join(" ")}</white>`);
    }
  },
  cd(dir = null) {
    if (dir === null || (dir === ".." && cwd !== root)) {
      cwd = root;
    } else if (dir.startsWith("~/") && dirs.includes(dir.substring(2))) {
      cwd = dir;
    } else if (dirs.includes(dir)) {
      cwd = root + "/" + dir;
    } else {
      this.error("Wrong directory");
    }
  },
  ls(dir = null) {
    if (dir) {
      if (dir.match(/^~\/?$/)) {
        // ls ~ or ls ~/
        print_dirs();
      } else if (dir.startsWith("~/")) {
        const path = dir.substring(2);
        const dirs = path.split("/");
        if (dirs.length > 1) {
          this.error("Invalid directory");
        } else {
          const dir = dirs[0];
          this.echo(directories[dir].join("\n"));
        }
      } else if (cwd === root) {
        if (dir in directories) {
          this.echo(directories[dir].join("\n"));
        } else {
          this.error("Invalid directory");
        }
      } else if (dir === "..") {
        print_dirs();
      } else {
        this.error("Invalid directory");
      }
    } else if (cwd === root) {
      print_dirs();
    } else {
      const dir = cwd.substring(2);
      this.echo(directories[dir].join("\n"));
    }
  },
  async joke() {
    const res = await fetch(url);
    const data = await res.json();
    (async () => {
      if (data.type == "twopart") {
        // we set clear the prompt to don't have any
        // flashing between animations
        const prompt = this.get_prompt();
        this.set_prompt("");
        // as said before in every function, passed directly
        // to terminal, you can use `this` object
        // to reference terminal instance
        await this.echo(`Q: ${data.setup}`, {
          delay: 50,
          typing: true,
        });
        await this.echo(`A: ${data.delivery}`, {
          delay: 50,
          typing: true,
        });
        // we restore the prompt
        this.set_prompt(prompt);
      } else if (data.type === "single") {
        await this.echo(data.joke, {
          delay: 50,
          typing: true,
        });
      }
    })();
  },
  credits() {
    return [
      "",
      "<white>Used libraries:</white>",
      '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
      '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
      '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
      '* <a href="https://jokeapi.dev/">Joke API</a>',
      "",
    ].join("\n");
  },
};

function prompt() {
  return `[[;#44D544;]${user}@${server}]:[[;blue;]${cwd}$] `;
}

const command_list = ["clear"].concat(Object.keys(commands));
const formatted_list = command_list.map((cmd) => {
  return `<white class="command">${cmd}</white>`;
});

const help = formatter.format(formatted_list);

const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  exit: false,
  completion(string) {
    // in every function we can use `this` to reference term object
    const cmd = this.get_command();
    // we process the command to extract the command name
    // at the rest of the command (the arguments as one string)
    const { name, rest } = $.terminal.parse_command(cmd);
    if (["cd", "ls"].includes(name)) {
      if (rest.startsWith("~/")) {
        return dirs.map((dir) => `~/${dir}`);
      }
      if (cwd === root) {
        return dirs;
      }
    }
    return Object.keys(commands);
  },
  prompt,
});

//You click a command from help and you can execute it
term.on("click", ".command", function () {
  const command = $(this).text();
  term.exec(command);
});

term.on("click", ".directory", function () {
  const dir = $(this).text();
  term.exec(`cd ~/${dir}`);
});

const re = new RegExp(`^\s*(${command_list.join("|")}) (.*)`);

// Colors and renders
function render(text) {
  const cols = term.cols();
  return trim(
    figlet.textSync(text, {
      font: font,
      width: cols,
      whitespaceBreak: true,
    })
  );
}

function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function ready() {
  const seed = rand(256);
  term
    .echo(() => rainbow(render("Terminal Portfolio"), seed))
    .echo("<white>Welcome to my Terminal Portfolio</white>\n")
    .resume();
}

function rainbow(string, seed) {
  return lolcat
    .rainbow(
      function (char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
      },
      string,
      seed
    )
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

function trim(str) {
  return str.replace(/[\n\s]+$/, "");
}

$.terminal.new_formatter(function (string) {
  return string.replace(re, function (_, command, args) {
    return `[[;white;]${command}] [[;aqua;]${args}]`;
  });
});

$.terminal.xml_formatter.tags.blue = (attrs) => {
  return `[[;#55F;;${attrs.class}]`;
};
