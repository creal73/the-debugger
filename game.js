export class Game {

    constructor() {
        this.isCreatingBug = false;
        this.startingPosition = { x: NaN, y: NaN };
        this.endingPosition = { x: NaN, y: NaN };
    }

    get canvas() {
        return document.querySelector('[data-game]');
    }

    get newBug() {
        return this.canvas.getElementsByClassName('bug new')[0]; // there can only be one "new" bug!
    }

    /**
     * Launch the game
     */
    run() {
        console.debug("Game::run()");

        this.canvas.onmousedown = event => this.initializeNewBug(event);
        this.canvas.onmouseup = event => this.onMouseUp(event);
        this.canvas.onmousemove = event => this.onMouseMove(event);
        this.canvas.onmouseleave = () => this.onMouseLeave();
    }

    /**
     * Creates an element representing a 'bug'.
     * 
     * @returns {HTMLDivElement} The 'div' representing the newly created bug.
     */
    createBugElement() {
        let bugElement = document.createElement('div');
        bugElement.classList.add('bug');
        bugElement.classList.add('new');

        bugElement.style.backgroundColor = this.generateRandomColor();

        return bugElement;
    }

    /**
     * Callback for mousedown event
     */
    initializeNewBug(event) {
        this.isCreatingBug = true;
        console.debug(`Starting position is { x: ${event.clientX}, y: ${event.clientY} }`);
        this.startingPosition = { x: event.clientX, y: event.clientY };

        let bug = this.createBugElement();
        bug.style.top = `${this.startingPosition.y}px`;
        bug.style.left = `${this.startingPosition.x}px`;
        this.canvas.appendChild(bug);
    }

    /**
     * Callback for mouseup event
     */
    onMouseUp(event) {
        this.isCreatingBug = false;
        console.debug(`Ending position is { x: ${event.clientX}, y: ${event.clientY} }`);
        this.endingPosition = { x: event.clientX, y: event.clientY };

        const coordinates = this.computeBugCoordinates(this.startingPosition, this.endingPosition);
        this.newBug.style.height = `${coordinates.height}px`;
        this.newBug.style.width = `${coordinates.width}px`;
        this.newBug.style.top = `${coordinates.top}px`;
        this.newBug.style.left = `${coordinates.left}px`;
        this.newBug.classList.remove('new');
    }

    /**
     * Callback for mousemove event
     * 
     * Will execute only if we are creating a new 'bug'
     */
    onMouseMove(event) {

        if (!this.isCreatingBug) {
            return;
        }

        // console.debug(`Current position is { x: ${event.clientX}, y: ${event.clientY} }`);
        this.endingPosition = { x: event.clientX, y: event.clientY };
        const coordinates = this.computeBugCoordinates(this.startingPosition, this.endingPosition);
        this.newBug.style.height = `${coordinates.height}px`;
        this.newBug.style.width = `${coordinates.width}px`;
    }

    onMouseLeave() {

        if (!this.isCreatingBug) {
            return;
        }

        console.debug('Mouse is outside the drawing zone !');

        this.isCreatingBug = false;
        this.canvas.removeChild(this.newBug);
    }

    /**
     * Computes the bug's characteristics from mouse positions
     * @param {x: number, y: number} startingPosition 
     * @param {x: number, y: number} endingPosition
     */
    computeBugCoordinates(startingPosition, endingPosition) {
        if (startingPosition && startingPosition.x && startingPosition.y) {
            let height = Math.abs(endingPosition.y - startingPosition.y);
            let width = Math.abs(endingPosition.x - startingPosition.x);
            let top = startingPosition.y;
            let left = startingPosition.x;

            let coord = {
                height: height,
                width: width,
                top: top,
                left: left,
            }

            return coord;
        }
    }

    /**
     * Generates a random color for the bug
     */
    generateRandomColor() {
        // We generate a random number, 
        // then we convert it to hexadecimal and to finish, we extract 6 digits after the decimal
        // e.g.
        // > 0.651247510008238 -> "0.a6b8282516398" -> "a6b828"
        let randomHexNumber = Math.random().toString(16).substr(2, 6);

        return '#' + randomHexNumber;
    }
}