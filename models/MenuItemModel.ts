export default class {
    id? = '';
    href? = '';
    text? = '';
    svgIcon? = '';
    isSeparator? = false;
    onClick?: () => void = () => {
        return;
    }
}