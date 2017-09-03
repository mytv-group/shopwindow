export default function sprintf(fmt, ...args){
    return fmt
        .split('%%')
        .reduce((aggregate, chunk, i) =>
            aggregate + chunk + (args[i] || ''), '');
}
