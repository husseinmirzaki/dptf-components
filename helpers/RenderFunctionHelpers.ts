import {h} from "vue";
import InlineSvg from "vue-inline-svg";

function addClass(klass, add: string) {
    if (klass) {
        if (Array.isArray(klass)) {
            klass.push(add)
        } else if (typeof klass == "string") {
            klass += " " + add
        } else {
            klass = [
                add,
                klass
            ]
        }
    } else {
        klass = [add]
    }
    return klass
}


function button(props: any, children: any, type = "") {

    if (!props) {
        props = {}
    }

    props['type'] = 'button';

    props['class'] = addClass(props['class'], 'btn');
    props['class'] = addClass(props['class'], type);

    return h('button', props, children)
}

function icon(props: any) {

    if (!props) {
        props = {};
    }


    props['class'] = addClass(props['class'], 'svg-icon');

    return h(
        'span',
        props,
        h(InlineSvg, {src: props['src']})
    );
}

function dropDownButtonWarp(props: any) {
    if (!props) {
        props = {}
    }

    if (!props['data-kt-menu-trigger'])
        props['data-kt-menu-trigger'] = "click";

    if (!props['data-kt-menu-placement'])
        props['data-kt-menu-placement'] = "bottom-start";

    if (!props['data-kt-menu-flip'])
        props['data-kt-menu-flip'] = "top-end";


    return props;
}


export const DEFAULT_BUTTONS = {
    "default": (props: any, children: any, type = "") => button(props, children, type),
    "primary": (props: any, children: any) => DEFAULT_BUTTONS.default(props, children, "btn-primary"),
    "secondary": (props: any, children: any) => DEFAULT_BUTTONS.default(props, children, "btn-secondary"),
    "icon": (buttonProps: any, iconProps: any) => {
        return DEFAULT_BUTTONS.default(buttonProps, icon(iconProps))
    },
    "icon_1": (buttonProps: any, iconProps: any) => {

        if (!buttonProps) {
            buttonProps = {};
        }

        if (!buttonProps['class'])
            buttonProps['class'] = ['btn-sm btn-icon btn-color-primary btn-active-light-primary ms-2']

        console.log("props", buttonProps)

        return DEFAULT_BUTTONS.icon(buttonProps, iconProps);
    }
}

export const DROPDOWN_BUTTONS = {
    "default": (props: any, children: any) => button(dropDownButtonWarp(props), children, ""),
    "primary": (props: any, children: any) => button(dropDownButtonWarp(props), children, "btn-primary"),
    "secondary": (props: any, children: any) => button(dropDownButtonWarp(props), children, "btn-secondary"),
    "icon": (buttonProps: any, iconProps: any) => {
        return button(dropDownButtonWarp(buttonProps), icon(iconProps))
    },
    "icon_1": (buttonProps: any, iconProps: any) => {

        if (!buttonProps) {
            buttonProps = {};
        }

        if (!buttonProps['class'])
            buttonProps['class'] = ['btn-sm btn-icon btn-color-primary btn-active-light-primary ms-2']

        console.log("props", buttonProps)

        return DROPDOWN_BUTTONS.icon(buttonProps, iconProps);
    }
}