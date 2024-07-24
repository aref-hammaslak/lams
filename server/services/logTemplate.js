import LogTemplate from "../models/LogTemplate.js";

/**
 * @param {LogTemplate} logTemplate log template
 */
export function getLogTemplateItems(logTemplate) {
    return logTemplate.items.reduce((acc, it,) => {
        let type;
        switch (it.type) {
            case 0: // Checkbox
                type = 'boolean';
                break;
            case 1: // Text
                type = 'string';
                break;
            case 2: // Number
                type = 'number';
                break;
            case 3: // Option
            case 4: // Option
            case 5: // Option
                type = 'string';
                break;
            default:
                type = undefined;
        }

        acc[it.label] = type;

        return acc;
    }, {});
}