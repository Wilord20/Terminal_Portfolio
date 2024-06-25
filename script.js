const font = "Larry 3D";
const root = "~";
let cwd = root;
const user = "user23";
const server = "user23-HP-114";
const url = "https://v2.jokeapi.dev/joke/Programming";

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const directories = {
  formation: [
    "",
    "<white>JavaScript - HTML/CSS</white>",
    [
      [
        "Back End Development and APIs",
        "https://www.freecodecamp.org/certification/fcca1096821-80d5-4b02-9374-415db363c5e3/back-end-development-and-apis",
        "Back end apps with Node.js and npm, Express Framework, MongoDB and Mongoose library",
      ],
      [
        "JavaScript Algorithms and Data Structures",
        "https://freecodecamp.org/certification/fcca1096821-80d5-4b02-9374-415db363c5e3/javascript-algorithms-and-data-structures-v8",
        "Fundamentals, OOP, Functional Programming, local storage and APIs",
      ],
      [
        "The Origins: JavaScript III",
        "https://www.credential.net/5aec68fd-6a30-418b-a774-a94d0d8d8fa8",
        "Fundamentals and use of APIs",
      ],
      [
        "Responsive Web Design",
        "https://freecodecamp.org/certification/fcca1096821-80d5-4b02-9374-415db363c5e3/responsive-web-design",
        "Fundamentals HTML and CSS",
      ]
    ].map(([name, url, description = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
    "<white>Python</white>",
    [
      [
        "Python 3, Django, Flask and Tkinter",
        "https://www.udemy.com/certificate/UC-6da717e5-6343-41b1-a7b7-d1f22a28bafb/",
        "Fundamentals of Python, Data Structures and Web Development with Django",
      ]
    ].map(([name, url, description = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
    "<white>Spring, Java and MS</white>",
    [
      [
        "Angular",
        "https://www.udemy.com/certificate/UC-9f3378d4-9ddd-4dfd-b68c-8ed34896bf40/",
        "Use of Angular, Web Development",
      ],
      [
        "Microservices with Spring Boot and Spring Cloud",
        "https://www.udemy.com/certificate/UC-c5a38eaa-ac17-432e-8387-54dd4719210f/",
        "How to implement Spring Cloud in our solution, creation of MS",
      ],
      [
        "Spring Boot 2 and Spring Framework 5",
        "https://www.udemy.com/certificate/UC-ad39c8b5-36dd-4dca-909c-a1d37436a30a",
        "How to use both, the fundamentals and use cases",
      ],
      [
        "Kubernetes",
        "https://www.udemy.com/certificate/UC-bba3cc6a-7ea8-41cb-9e61-06b3db1d02b7/",
        "Dockers, YAML files and setting up Kubernetes through Bash",
      ]
    ].map(([name, url, description = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
  ].flat(),
  projects: [
    "",
    "<white>Projects</white>",
    [
      [
        "This Terminal",
        "https://github.com/Wilord20/Terminal_Portfolio",
        "A project to test my acquired knowledge usign JS, HTML/CSS, Node.js, npm and others",
      ],
      [
        "Pokedex",
        "https://github.com/Wilord20/Pokedex",
        "One of the final projects of freeCodeCamp. I use PokeAPI and HTML/CSS to make a functional Pokedex",
      ],
      [
        "Weather",
        "https://wilord20.github.io/Final-Project-JS/",
        "Also, one of the final projects of Codedex. A simple web app where you can look up the weather in your location",
      ],
    ].map(([name, url, description = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
  ].flat(),
  skills: [
    "",
    "<white>Languages</white>",
    ["JS", "Python", "SQL", "Java", "Bash", "C#", "HTML/CSS", "Mongo"].map((lang) => `* <yellow>${lang}</yellow>`),
    "",
    "<white>Libraries/Frameworks</white>",
    ["Django", "Jest", "Angular", "Spring", "mongoose", "Express", "tkinter"].map((lib) => `* <green>${lib}</green>`),
    "",
    "<white>Tools</white>",
    ["Docker", "git", "GNU/Linux", "Kubernetes", "Docker"].map((tool) => `* [[;blue;]${tool}]`),
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

const intro = `Welcome to my terminal, I'm Edgar.\nHere you can see the projects I have worked on, learned and the skills I have.\nYou can start typing or clicking <white class="command">help</white> to see the commands.`;

term.echo(intro, { typing: true, delay: 10 });

function ready() {
  const seed = rand(256);
  term
    .echo(() => rainbow(render("Portfolio"), seed))
    .echo('\n<a href="https://www.linkedin.com/in/edgar-yael-torres-sánchez-471448238/">&#128188;Linkedin</a> <a href="https://github.com/Wilord20">&#128187;GitHub</a>\n')
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

