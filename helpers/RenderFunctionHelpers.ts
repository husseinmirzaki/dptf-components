import {h, onMounted, resolveComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {VueInstanceService} from "@/Defaults";

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

function col(options, children) {
    return h(
        'div',
        Object.assign({}, options),
        children
    );
}

function row(options, children) {
    return h(
        'div',
        Object.assign({class: 'row'}, options),
        children
    );
}

export const DEFAULT_COLS = {
    "row": (options, children) => row(options, children),
    "col": (options, children) => col(options, children),
    "col1": (children) => col({class: 'col-2'}, children),
    "col2": (children) => col({class: 'col-2'}, children),
    "col3": (children) => col({class: 'col-3'}, children),
    "col4": (children) => col({class: 'col-4'}, children),
    "col5": (children) => col({class: 'col-5'}, children),
    "col6": (children) => col({class: 'col-6'}, children),
    "col7": (children) => col({class: 'col-7'}, children),
    "col8": (children) => col({class: 'col-8'}, children),
    "col9": (children) => col({class: 'col-9'}, children),
    "col10": (children) => col({class: 'col-10'}, children),
    "col11": (children) => col({class: 'col-11'}, children),
    "col12": (children) => col({class: 'col-12'}, children),
}

export function routerView() {
    return {
        setup() {
            return () => h(resolveComponent('router-view'))
        }
    }
}

export function setPageTitleUtil(title: string) {
    onMounted(() => {
        VueInstanceService.setPageTitle(title);
    });
}