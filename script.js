$(function () {
    $('body').terminal({
        // La funcion 'hello' requiere de una variable, en este caso 'what'
        hello: function (what) {
            this.echo('Hello, ' + what +
                '. Welcome to this terminal.');
        },
        // Aquí 'cat' es una funcion que no necesita de una variable y solo regresará una imagen
        cat: function (width, height) {
            const img = $('<img src="https://placekitten.com/' +
                width + '/' + height + '">', { raw: true });
        // Añadimos un load y pause en caso de conexiones lentas
            img.on('load', this.resume);
            this.pause();
            this.echo(img);
        }
    }, {
        greetings: 'My First Web Terminal'
    });
});
