export function formFromOptions(options: Record<string, any>) {
    const built = Object.values(options)
        .filter((d: any) => {
            return d['label'].search(/(ID)|(created_at)|(updated_at)/)
        })
        .map((d: any) => {
            switch (d['type']) {
                case 'integer':
                    d.field_type = 'number';
                    break;
                case 'string':
                    d.field_type = 'text';
                    break;
                case 'choice':
                    d.field_type = 'select';
                    d.select_data = d.choices.map((s) => {
                        return [s.value, s.display_name];
                    });
                    break;
            }
            delete d['type']
            delete d['read_only']
            return d;
        });
    console.log(built);
    return built;
}