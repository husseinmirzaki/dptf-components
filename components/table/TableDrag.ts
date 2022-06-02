export class SimpleDrag {
    mouseIsDown = false;
    lastMouseDownEvent: MouseEvent | null = null;
    lastTargetDrag: HTMLElement | null = null;
    lastDraggingElement: HTMLElement | null = null;
    removeOnMouseUp: Array<HTMLElement> = [];

    itemDropped(element) {
        //
    }

    currentX = 0;
    currentY = 0;
    offsetX = 0;
    offsetY = 0;
    elements = {};

    constructor() {

        this.findElements();
        console.log(Object.keys(this.elements));
    }

    findElements() {
        this.elements = {};
        document.querySelectorAll('[moveable]').forEach((element, index) => {
            console.log("test on some tables", element);
            if (element.hasAttribute('group')) {
                const group = this.getElementGroup(element)
                if (!this.elements[group])
                    this.elements[group] = [];

                this.elements[group].push(element);
            } else {

                if (!this.elements['no-group'])
                    this.elements['no-group'] = [];

                this.elements['no-group'].push(element);
            }
        });
    }

    iterateOn(cb, group: string | null = null) {
        if (group) {
            this.elements[group].forEach((element, index) => {
                cb(element, index, group);
            });
        } else {
            Object.keys(this.elements).forEach((group) => {
                this.iterateOn((element, index, group) => {
                    cb(element, index, group)
                }, group);
            })
        }
    }

    addMouseEvents() {
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        document.addEventListener('mousemove', (e) => this.onGlobalMouseMove(e));

        this.iterateOn((element) => {
            element.addEventListener('mousedown', (e) => this.onMouseDown(e));
            element.addEventListener('mousemove', (e) => this.onElementMouseMove(e));
        });
    }

    getElementGroup(element) {
        return element.getAttribute('group');
    }

    classToGroup(group, klass, remove = false, excludeElement = null) {
        this.iterateOn(
            (element) => {
                if (element !== excludeElement)
                    if (remove)
                        element.classList.remove(klass)
                    else
                        element.classList.add(klass)
            },
            group
        );
    }

    itemIsMoving(element) {
        //const group = this.getElementGroup(element);
        //this.classToGroup(group, 'is-replace-able', false, element);
    }

    onMouseUp(e) {
        console.log("console.log", e);
        this.mouseIsDown = false;

        if (this.lastDraggingElement && this.lastTargetDrag) {
            this.itemDropped(this.lastTargetDrag);
            this.lastDraggingElement.remove();
        }

        this.removeOnMouseUp.forEach((element) => element.remove());
        this.removeOnMouseUp = [];

        this.lastDraggingElement = null;
    }

    onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        this.mouseIsDown = true;
        this.lastMouseDownEvent = e;
    }

    onGlobalMouseMove(e) {
        if (this.mouseIsDown && this.lastDraggingElement != null) {
            this.currentY = e.y - this.offsetY;
            this.currentX = e.x - this.offsetX;
            this.lastDraggingElement.style.left = this.currentX + 'px';
            this.lastDraggingElement.style.top = this.currentY + 'px';
        }
    }

    cloneWithStyle(target, exclude = '(animation)|(opacity)|(transition)') {
        const clone = target.cloneNode(true);
        const styles = getComputedStyle(target) as any;
        for (const i of styles) {
            if (i.search(exclude) > -1)
                continue;
            clone.style[i] = styles[i];
        }
        return clone;
    }

    getBB(element) {
        return element.getBoundingClientRect();
    }

    onElementMouseMove(e) {
        e.preventDefault();
        if (this.mouseIsDown && this.lastDraggingElement == null) {

            let currentTarget = this.lastMouseDownEvent!.target as HTMLElement;

            while (!currentTarget.hasAttribute('moveable')) {
                currentTarget = currentTarget.parentElement!;
            }

            const target = currentTarget;
            this.lastTargetDrag = currentTarget;

            const clone = this.cloneWithStyle(target);
            clone.style.position = 'absolute';
            this.lastDraggingElement = clone;

            this.offsetX = this.lastMouseDownEvent!.offsetX;
            this.offsetY = this.lastMouseDownEvent!.offsetY;

            clone.classList.add('show-animation');
            clone.setAttribute('dragged', 'dragged');

            document.body.append(clone);

            this.itemIsMoving(this.lastTargetDrag);

            this.iterateOn((element) => {
                if (element !== this.lastTargetDrag) {
                    const cloned = this.cloneWithStyle(element);
                    const clonedBB = this.getBB(element);

                    cloned.style.position = 'absolute';
                    cloned.style.top = clonedBB.top + 'px';
                    cloned.style.left = clonedBB.left + 'px';
                    cloned.classList.add('is-replace-able');

                    document.body.append(cloned);

                    this.removeOnMouseUp.push(cloned);

                    cloned.addEventListener('mouseenter', (e) => {
                        cloned.classList.add("selected-this-one");
                    })
                    cloned.addEventListener('mouseleave', (e) => {
                        cloned.classList.remove("selected-this-one");
                    })

                    cloned.addEventListener('mouseup', (e) => {

                        const marker1 = document.createElement('div');
                        const marker2 = document.createElement('div');
                        console.log(this.lastTargetDrag!, element)
                        this.lastTargetDrag!.before(marker1);
                        element.before(marker2)

                        marker1.before(element);
                        marker2.before(this.lastTargetDrag!);

                        marker1.remove();
                        marker2.remove();

                    })

                }
            }, this.getElementGroup(target))

        }
    }

}