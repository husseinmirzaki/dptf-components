export function random(times = 2, dot = true) {
    const s = () => {
        // console.log("dot", dot);
        if (!dot) {
            return String(
                Math.round(Number(Math.random() * 9999999 + Math.random() * 400))
            );
        }
        return String(Math.random() * 99999 + Math.random() * 50);
    };
    let sequence = "";
    for (let i = 0; i < times; i++) {
        sequence += s();
    }
    // console.log("generated sequence", sequence);
    return sequence;
}

export function randomId(times = 2) {
    return random(times, false);
}

export function findClassInParent(element, _class) {
    let parent = element.parentElement;
    let parentClass;
    for (let i = 0; i < 50; i++) {
        if (parent == null)
            return null;

        parentClass = parent.classList;

        if (parentClass.contains(_class))
            return parent;
        parent = parent.parentElement;
    }
    return null;
}

export function findStyleValueInParent(element, key, value) {
    let parent = element.parentElement;
    let parentStyle;
    for (let i = 0; i < 15; i++) {
        if (parent == null)
            return null;

        parentStyle = getComputedStyle(parent);

        if (parentStyle[key] === value)
            return parent;
        parent = parent.parentElement;
    }
    return null;
}

/**
 * width: integer, width of image in px
 * height: integer, height of image in px;
 * x: integer, horizontal distance from left
 * y: integer, vertical distance from top
 * scale: float, scale factor (1,5 = 150%)
 */
export function scaleCoordinates(width, height, x, y, scale) {
    const centerX = width / 2;
    const centerY = height / 2;
    const relX = x - centerX;
    const relY = y - centerY;
    const scaledX = relX * scale;
    const scaledY = relY * scale;
    return {x: scaledX + centerX, y: scaledY + centerY};
}