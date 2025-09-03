import { writable } from 'svelte/store';

const colorMode = writable<string>('light'); // temporary default

if (typeof window !== 'undefined') {
	// get what's already set by app.html
	const attr = document.documentElement.getAttribute('color-mode') || 'light';
	colorMode.set(attr);
}

function setMode(mode: string): void {
	document.documentElement.setAttribute('color-mode', mode);
	localStorage.setItem('color-mode', mode);
	colorMode.set(mode);
}

function toggleMode(): void {
	colorMode.update((current: string) => {
		const newMode = current === 'dark' ? 'light' : 'dark';
		setMode(newMode);
		return newMode;
	});
}

export { colorMode, setMode, toggleMode };
