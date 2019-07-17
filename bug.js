export class Bug {

    constructor({ top, left }, { height, width }) {
        this.size = {
            height: height,
            width: width
        };

        this.position = {
            top: top,
            left: left
        };

        this.element = this.createElement();
    }

    /**
     * Creates an HTMLElement corresponding to the bug model
     */
    createElement() {
        let element = document.createElement('div');

        // Add class to identify or select element
        element.classList.add('bug');

        // Add a random background color
        element.style.backgroundColor = this.generateRandomColor();

        // Set position
        element.style.top = `${this.position.top}px`;
        element.style.left = `${this.position.left}px`;

        return element;
    }

    /**
     * Sets the size of the bug
     * @param {height: number; width: number} param0 
     */
    setSize({ height, width }) {
        this.size.height = height;
        this.size.width = width;

        if (this.element) {
            this.element.style.height = this.size.height + 'px';
            this.element.style.width = this.size.width + 'px';
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