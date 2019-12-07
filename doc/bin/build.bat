cd %~dp0
cd ..

pdflatex -file-line-error -interaction=nonstopmode -synctex=1 -output-format=pdf -aux-directory=C:/git/DocLicenta/auxil -output-directory=out thesis.tex
bibtex