export default class {
    id? = '';
    href? = '';
    link? = '';
    text? = '';
    svgIcon? = '';
    isSeparator? = false;
    onClick?: () => void = () => {
        return;
    }
}