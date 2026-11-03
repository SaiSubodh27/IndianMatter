# Thin patch layer on top of the image you already built (quick: no big downloads).
# The authors' image resolved pandas to 3.x, which needs numpy>=2, but PyTorch 2.1 needs numpy 1.26.
ARG BASE=main/crystalframer:latest
FROM ${BASE}
RUN python -m pip install --no-cache-dir "pandas==2.2.3" "numpy==1.26.4" && \
    python -c "import numpy, pandas; print('numpy', numpy.__version__, '| pandas', pandas.__version__)"
