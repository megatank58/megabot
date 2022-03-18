import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	entry: ['src/**/*.ts'],
	minify: false,
	tsconfig: './tsconfig.json',
	target: 'esnext',
	outDir: '.build',
	bundle: false,
	shims: false,
	keepNames: true,
	splitting: false,
});
