Game.UnitCircle = function(game) {};

Game.UnitCircle.prototype = {
    create:function() {
        // Enable mouse click events
        this.game.input.mouse.capture = true;

        //  Background
        bg = this.add.sprite(0, 0, 'bg');
        bg.scale.setTo(0.125, 0.125);
        bg.y += this.world.height/2.

        // Unit Circle
        this.unit_circle = this.add.sprite(this.world.width/2., this.world.height/2., 'unit_circle');
        this.unit_circle.scale.setTo(0.75, 0.75);
        this.unit_circle.x -= this.unit_circle.width/2.;
        this.unit_circle.y -= this.unit_circle.height/2.;
        this.degrees = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
        this.sprite_degrees = [-90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270];

        // Angle line
        this.angle_update = 0.3;
        this.angle_line = this.add.sprite(this.world.width/2., this.world.height/2., 'angle');
        this.angle_line.anchor.setTo(0.5, 1);

        // Equation text
        this.equation_text = this.add.text(this.world.width/2., this.world.height/8., "", {
            font: "30px Arial",
            fill: "#000000",
            align: "center"
        });
        this.equation_text.anchor.setTo(0.5, 0.5);

        // Result icons
        // 30 px Arial
        this.yes_icon = this.add.sprite(this.equation_text.x - this.equation_text.width -300, this.equation_text.y, 'yes');
        this.yes_icon.anchor.setTo(0.5, 0.5);
        this.yes_icon.visible = false;
        this.no_icon = this.add.sprite(this.equation_text.x - this.equation_text.width -300, this.equation_text.y, 'no');
        this.no_icon.anchor.setTo(0.5, 0.5);
        this.no_icon.visible = false;

        // Showing result icon
        this.showing_result = false;

        // Correct icon timer
        this.correct_timer = this.game.time.create(false);
        this.correct_timer.loop(500, this.onCorrectTimer, this);
        this.correct_timer.start();
        this.correct_timer.pause();

        // Incorrect icon timer
        this.incorrect_timer = this.game.time.create(false);
        this.incorrect_timer.loop(500, this.onIncorrectTimer, this);
        this.incorrect_timer.start();
        this.incorrect_timer.pause();

        // Generate the solution table
        this.sines_table = this.setupSinesTable();
        this.cosines_table = this.setupCosinesTable();

        // Set up a new problem
        this.equations = this.createEquations();
        this.active_equation = this.equations[0];
        this.equation_text.setText(this.active_equation.equation + "(θ)=" + this.active_equation.point);
        console.log("A new equation set has started!");

        // Check the answer after mouse click events
        this.game.input.onDown.add(this.checkAnswer, this);
    },

    checkAnswer: function() {
        if (this.showing_result == false) {
            var angle = -Phaser.Math.roundTo(this.angle_line.angle, 0) + 90;
            if (angle < 0) {
                angle += 360;
            }
            this.equation_text.setText(this.active_equation.equation + "(" + angle.toString() + "°)=" + this.active_equation.point);
            if (this.active_equation.solution.includes(angle)) {
                console.log("correct!");
                this.yes_icon.visible = true;
                this.showing_result = true;
                this.correct_timer.resume();
                console.log("Timer started.");
            } else {
                console.log("wrong");
                this.no_icon.visible = true;
                this.showing_result = true;
                this.incorrect_timer.resume();
                console.log("Timer started.");
            }
        }
    },

    onCorrectTimer: function() {
        this.correct_timer.pause();
        console.log("Timer stopped");
        this.yes_icon.visible = false;
        this.updateEquation();
        this.angle_update = -this.angle_update;
        this.showing_result = false;
    },

    onIncorrectTimer: function() {
        this.incorrect_timer.pause();
        console.log("Timer stopped");
        this.no_icon.visible = false;
        this.showing_result = false;
    },

    updateEquation: function() {
        if (this.equations.length > 0) {
            this.equations.splice(0, 1);
        } else {
            // All equations were solved!
            console.log("All equations were solved!");

            // Set up a new problem
            this.equations = this.createEquations();
            console.log("A new equation set has started!");
        }
        this.active_equation = this.equations[0];
        this.equation_text.setText(this.active_equation.equation + "(θ)=" + this.active_equation.point);
    },


    createEquations: function () {
        // Set up a queue of all possible string problems and solutions.
        // Creates an array of tuples with problem at 0 and solution at 1, and then shuffles it.
        points = ["-1","-√3/2","-√2/2","0","1/2","√2/2","√3/2","1"];
        equations = [];
        while (points.length > 0) {
            // Get random index
            index = this.rnd.integerInRange(0, points.length-1)
            value = points[index];
            sine_data = {
                "equation": "sin",
                "point": value,
                solution: this.sines_table[value] };
            cosine_data = {
                "equation": "cos",
                "point": value,
                "solution": this.cosines_table[value] };
            equations.push(sine_data);
            equations.push(cosine_data);
            points.splice(index, 1);
        }
        this.shuffleArray(equations);

        return equations;
    },


    shuffleArray: function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },


    setupSinesTable: function () {
        // Generates a table with unit circle coordinates as keys and degrees as values
        sines = {
            "-1": [270],
            "-√3/2": [240, 300],
            "-√2/2": [225, 315],
            "-1/2": [210, 330],
            "0": [0, 360],
            "1/2": [30, 150],
            "√2/2": [45, 135],
            "√3/2": [60, 120],
            "1": [90] }

        return sines;
    },


    setupCosinesTable: function () {
        // Generates a table with unit circle coordinates as keys and degrees as values
        cosines = {
            "-1": [180],
            "-√3/2": [150, 210],
            "-√2/2": [135, 225],
            "-1/2": [120, 240],
            "0": [90, 270],
            "1/2": [60, 300],
            "√2/2": [45, 315],
            "√3/2": [30, 330],
            "1": [0] }

        return cosines;
    },


    update: function () {
        if (this.showing_result == false) {
            var sprite_angle = this.getAngleFromMousePosition();

            // Find the closest angle from the choices given
            var angle_choice = this.closest(sprite_angle, this.sprite_degrees);
            this.angle_line.angle = angle_choice;
        }
    },

    getAngleFromMousePosition() {
        // Get the sprite angle based on the mouse position relative to the game center
        center_x = this.world.width/2.
        center_y = this.world.height/2.
        var delta_x = this.game.input.mousePointer.x - center_x;
        var delta_y = this.game.input.mousePointer.y - center_y;
        theta_radians = Math.atan2(delta_y, delta_x);

        // Adding 90 degrees is necessary to obtain the correct sprite angle
        sprite_angle = (theta_radians * (180 / Math.PI)) + 90;

        return sprite_angle;
    },

    wrapPlatform: function (platform) {
        // Half of platform width
        if (platform.y < 250) {
            platform.body.velocity.y = 100;
        } else if (platform.y > 450) {
            platform.body.velocity.y = -100;
        }
    },


    closest: function (num, arr) {
        var curr = arr[0];
         var diff = Math.abs(num - curr);
         for (var val = 0; val < arr.length; val++) {
             var newdiff = Math.abs(num - arr[val]);
             if (newdiff < diff) {
                 diff = newdiff;
                 curr = arr[val];
             }
         }
         return curr;
    },


}
