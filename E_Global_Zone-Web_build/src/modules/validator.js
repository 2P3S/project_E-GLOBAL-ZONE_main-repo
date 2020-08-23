/**
 * blankValidator
 * @param {any} arguments
 *
 * @return {boolean} returnValue
 */
export function blankValidator(){
    let returnValue = true;
    for (const argumentsKey in arguments) {
        if(arguments[argumentsKey] === ""){
            returnValue = false;
        };
    }
    return returnValue;
}