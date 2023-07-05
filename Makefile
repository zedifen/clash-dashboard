SHELL=/bin/bash

update-dist:
	git pull --rebase
	pnpm install
	pnpm build
	tar -czvf dist.tar.gz dist/
	git add .
	git commit -m "update dist"
	git push
