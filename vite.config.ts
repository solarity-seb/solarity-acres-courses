import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default {
	plugins: [
		sveltekit(),
		enhancedImages() 
	],
	server: {
		// Development server configuration
		port: 5173,
		host: true,
		fs: {
			allow: ['..']
		}
	},
	// Configure preview server as well
	preview: {
		port: 4173,
		host: true
	}
};
