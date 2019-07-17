import { Bug } from './bug';

export class Game {

    constructor() {
        this.stopDrawing();
        this.newBug;
        this.bugRemovingCounter = 0;
        this.bugsToDelete = [];
    }

    /**
     * Gets the drawing zone element
     */
    get canvas() {
        return document.querySelector('[data-game]');
    }

    /**
     * Gets all bug elements
     */
    get bugElements() {
        return this.canvas.querySelectorAll('.bug');
    }

    /**
     * Launches the game
     */
    run() {
        console.debug("Game::run()");

        this.canvas.onmousedown = event => this.initializeNewBug(event);
        this.canvas.onmouseup = () => this.onBugCreationFinished();
        this.canvas.onmousemove = event => this.setBugSize(event);
        this.canvas.onmouseleave = () => this.stopBugCreation();
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
     * 
     * Initializes a new bug
     */
    initializeNewBug(event) {

        console.debug("Game::initializeNewBug()");

        if (this.isCreatingBug) {
            this.stopDrawing();
            this.unsubscribeToBugsEvents();
        }

        this.isCreatingBug = true;

        // Remove pointer events on 'bugs' to prevent drawing fail
        document.querySelectorAll('.bug').forEach(element => element.classList.add('no-event'));

        this.startingPosition = { x: event.clientX, y: event.clientY };

        this.newBug = this.createBugElement({ top: this.startingPosition.y, left: this.startingPosition.x });
        this.canvas.appendChild(this.newBug.element);
    }

    /**
     * Callback for mouseup event
     * 
     * Ends up the bug creation
     */
    onBugCreationFinished() {
        console.debug("Game::onBugCreationFinished()");

        // Do not add a new bug if its size is not defined
        if (this.newBug && this.newBug.size && (!this.newBug.size.height || !this.newBug.size.width)) {
            this.canvas.removeChild(this.newBug.element);
        }

        this.stopDrawing();

        // Set back pointer events on 'bugs'
        document.querySelectorAll('.bug').forEach(element => element.classList.remove('no-event'));

        this.subscribeToBugsEvents();
    }

    /**
     * Callback for mousemove event
     * 
     * Sets the currently creating bug size
     * 
     * Will execute only if we are creating a new 'bug'
     */
    setBugSize(event) {

        if (!this.isCreatingBug) {
            this.stopDrawing();
            return;
        }

        this.endingPosition = { x: event.clientX, y: event.clientY };
        const coordinates = this.computeBugCoordinates(this.startingPosition, this.endingPosition);

        this.newBug.setSize({ height: coordinates.height, width: coordinates.width });
    }

    /**
     * Removes the bug element which is currently creating
     */
    stopBugCreation() {

        if (!this.isCreatingBug) {
            this.stopDrawing();
            return;
        }

        console.debug('stopBugCreation()::Mouse is outside the drawing zone !');

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

            return {
                height: height,
                width: width,
                top: top,
                left: left,
            };
        }
    }

    /**
     * Resets properties used for creation process
     */
    stopDrawing() {
        this.isCreatingBug = false;
        this.startingPosition = { x: NaN, y: NaN };
        this.endingPosition = { x: NaN, y: NaN };
        this.newBug = null;
    }

    /**
     * Subscribes to bugs mouse events
     */
    subscribeToBugsEvents() {
        this.bugElements.forEach(element => {
            // Catch and stop 'mouseDown' and 'mouseup' events propagation to prevent 'bug creation' mode to trigger
            element.onmousedown = event => event.stopPropagation();
            element.onmouseup = event => event.stopPropagation();

            // On Double click, we remove the current node after the end of the animation
            element.ondblclick = event => this.removeBug(event.target);
        });
    }

    /**
     * Unsubscribes to bugs events
     */
    unsubscribeToBugsEvents() {
        this.bugElements.forEach(element => {
            element.onmousedown = null;
            element.onmouseup = null;
            element.ondblclick = null;
        });
    }

    /**
     * Removes the given bug
     * @param {HTMLElement} bugElement 
     */
    removeBug(bugElement) {
        bugElement.classList.add('removing');

        // Increment a counter each time a remove animation is started
        bugElement.addEventListener('animationstart', () => {
            this.bugRemovingCounter++;
            console.debug(`Number of bugs currently removing is ${this.bugRemovingCounter}`);
        });

        // Decrement the counter each time a remove animation is ended
        bugElement.addEventListener('animationend', () => {
            this.bugRemovingCounter--;
            console.debug(`Number of bugs currently removing is ${this.bugRemovingCounter}`);
        });

        // Keep in memory the elements to remove
        this.bugsToDelete.push(bugElement);

        // Removes all the double clicked bugs when all animations are done
        this.canvas.addEventListener('animationend', () => {
            if (this.bugsToDelete && this.bugRemovingCounter === 0)
                this.bugsToDelete.forEach(bug => bug.remove());
        });
    }
}