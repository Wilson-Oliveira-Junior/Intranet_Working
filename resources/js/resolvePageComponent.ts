export function resolvePageComponent(name: string, pages: Record<string, () => Promise<any>>) {
    console.log('Resolving page:', name);
    const importPage = pages[`./Pages/${name}.tsx`];
    if (!importPage) {
        console.error(`Page not found: ${name}`);
        console.log('Available pages:', Object.keys(pages));
        throw new Error(`Page not found: ${name}`);
    }
    return importPage().then(module => {
        console.log('Imported module:', module);
        return module.default;
    });
}
