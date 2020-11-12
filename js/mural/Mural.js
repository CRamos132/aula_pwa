const Mural = (function (_render, Filtro) {
  "use strict";
  let cartoes = setCartoes();

  function setCartoes() {
    let cartoesLocal = JSON.parse(localStorage.getItem(usuario));
    if (cartoesLocal) {
      return cartoesLocal.map(
        (cartaoLocal) => new Cartao(cartaoLocal.conteudo, cartaoLocal.tipo)
      );
    } else {
      return [];
    }
  }

  cartoes.forEach((cartao) => {
    preparaCartao(cartao);
  });

  const render = () => _render({ cartoes: cartoes, filtro: Filtro.tagsETexto });
  render();

  Filtro.on("filtrado", render);

  function preparaCartao(cartao) {
    const urlsImgs = Cartao.pegaImagens(cartao);
    const prefix = "https://cors-anywhere.herokuapp.com/";
    urlsImgs.forEach((url) => {
      fetch(prefix + url).then((resposta) => {
        caches.open("ceep-imagens").then((cache) => {
          cache.put(url, resposta);
        });
      });
    });

    cartao.on("mudanca.**", salvaCartoes);
    cartao.on("remocao", () => {
      cartoes = cartoes.slice(0);
      cartoes.splice(cartoes.indexOf(cartao), 1);
      salvaCartoes();
      render();
    });
  }

  function salvaCartoes() {
    localStorage.setItem(
      usuario,
      JSON.stringify(
        cartoes.map((cartao) => {
          return { conteudo: cartao.conteudo, tipo: cartao.tipo };
        })
      )
    );
  }

  login.on("login", () => {
    cartoes = setCartoes();
    render();
  });
  login.on("logout", () => {
    cartoes = [];
    render();
  });

  function adiciona(cartao) {
    if (logado) {
      cartoes.push(cartao);
      salvaCartoes();
      cartao.on("mudanca.**", render);
      preparaCartao(cartao);
      let listaImagens = Cartao.pegaImagens(cartao);
      render();
      return true;
    }
  }

  return Object.seal({
    adiciona,
  });
})(Mural_render, Filtro);
