# How I Built This Wiki

When my project library started growing, I realized that a standard HTML website wasn't the best place to host technical documentation. I needed a space that allowed me to write in **Markdown** and automatically handled the navigation, search, and mobile responsiveness.

This guide explains how I integrated **MkDocs** into my existing website.

---

## 🏗️ The Tech Stack

To build this, I used:
* **[MkDocs](https://www.mkdocs.org/):** A static site generator geared towards project documentation.
* **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/):** A powerful theme that provides the search bar, sidebar, and dark mode.
* **Python/Pip:** To manage the MkDocs installation.
* **GitHub Pages:** For hosting the final files.
This project assumes you have Python3 installed which allows you to use pip to install the required packages.

---

## 🛠️ The Installation Process

### 1. Environment Setup
First, I installed the core software using the terminal:

```bash
pip install mkdocs
pip install mkdocs-material