import { Bug } from './bug';

export class Game {

    constructor() {
        this.stopDrawing();
        this.newBug;
    }

    get canvas() {
        return document.querySelector('[data-game]');
    }

    get bugElements() {
        return this.canvas.querySelectorAll('.bug');
    }

    /**
     * Launch the game
     */
    run() {
        console.debug("Game::run()");

        this.canvas.onmousedown = event => this.initializeNewBug(event);
        this.canvas.onmouseup = () => this.onMouseUp();
        this.canvas.onmousemove = event => this.onMouseMove(event);
        this.canvas.onmouseleave = () => this.onMouseLeave();
    }

    /**
     * Creates an element representing a 'bug'.
     * 
     * @returns {HTMLDivElement} The 'div' representing the newly created bug.
     */
    createBugElement({ top, left }) {
        return new Bug({ top: top, left: left }, { height: NaN, width: NaN });
    }

    /**
     * Callback for mousedown event
     */
    initializeNewBug(event) {

        console.debug("Game::onMouseDown()");

        if (this.isCreatingBug) {
            this.stopDrawing();
            this.unsubscribeToBugsEvents();
        }

        this.isCreatingBug = true;

        // Remove pointer events on 'bugs' to prevent drawing fail
        document.querySelectorAll('.bug').forEach(element => element.classList.add('no-event'));

        console.debug(`Starting position is { x: ${event.clientX}, y: ${event.clientY} }`);
        this.startingPosition = { x: event.clientX, y: event.clientY };

        this.newBug = this.createBugElement({ top: this.startingPosition.y, left: this.startingPosition.x });
        this.canvas.appendChild(this.newBug.element);
    }

    /**
     * Callback for mouseup event
     */
    onMouseUp() {
        console.debug("Game::onMouseUp()");
        this.stopDrawing();

        // Set back pointer events on 'bugs'
        document.querySelectorAll('.bug').forEach(element => element.classList.remove('no-event'));

        if (!this.isCreatingBug && this.newBug) {
            console.debug('onMouseUp::Remove bug !')
            this.newBug.element.remove();
        }

        this.subscribeToBugsEvents();
    }

    /**
     * Callback for mousemove event
     * 
     * Will execute only if we are creating a new 'bug'
     */
    onMouseMove(event) {

        if (!this.isCreatingBug) {

            if (this.newBug) {
                console.debug('onMouseMove::Remove bug !')
                this.newBug.element.remove();
            }

            this.stopDrawing();
            return;
        }

        this.endingPosition = { x: event.clientX, y: event.clientY };
        const coordinates = this.computeBugCoordinates(this.startingPosition, this.endingPosition);

        this.newBug.setSize({ height: coordinates.height, width: coordinates.width });
    }

    onMouseLeave() {

        if (!this.isCreatingBug) {
            this.stopDrawing();
            return;
        }

        console.debug('Mouse is outside the drawing zone !');

        this.isCreatingBug = false;
        this.canvas.removeChild(this.newBug.element);

        this.subscribeToBugsEvents();
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

    stopDrawing() {
        this.isCreatingBug = false;
        this.startingPosition = { x: NaN, y: NaN };
        this.endingPosition = { x: NaN, y: NaN };
        this.newBug = null;
    }

    subscribeToBugsEvents() {
        this.bugElements.forEach(element => {
            element.onmouseover = () => console.log('Mouse over bug !');
            element.onmousedown = event => {
                event.stopPropagation();
            };
            element.onmouseup = event => {
                event.stopPropagation();
            };

            element.ondblclick = event => {
                event.target.remove();
                console.log('double click')
            };
        });
    }

    unsubscribeToBugsEvents() {
        this.bugElements.forEach(element => {
            element.onmouseover = null;
            element.onmousedown = null;
            element.onmouseup = null;
            element.ondblclick = null;
        });
    }
}