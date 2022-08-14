export function formFromOptions(options: Record<string, any>) {
    return Object.values(options)
        .filter((d: any) => d['label'] != 'ID')
        .map((d: any) => {
            switch (d['type']) {
                case 'integer':
                    d.field_type = 'number';
                    break;
                case 'string':
                    d.field_type = 'text';
                    break;
            }
            return d;
        })
}