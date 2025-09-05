// Cria uma variável global pra armazenar os resultados
window.graphqlFraction1 = [];

// Hook no fetch
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  const url = typeof args[0] === 'string' ? args[0] : args[0].url;
  if (url.includes("https://ecs-em-graphql-api.jovensgenios.com/graphql")) {
    const clone = response.clone();
    clone.json().then(data => {
      try {
        if (data?.data?.questions) {
          data.data.questions.forEach(q => {
            q.answers?.forEach(ans => {
              if (ans.fraction === 1) {
                // Guarda o resultado na variável global
                window.graphqlFraction1.push({
                  fraction: ans.fraction,
                  text: ans.text
                });
              }
            });
          });
        }
      } catch (e) {}
    }).catch(() => {});
  }

  return response;
};

// Hook no XHR
(function() {
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._url = url;
    return origOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function(body) {
    this.addEventListener("load", function() {
      if (this._url.includes("https://ecs-em-graphql-api.jovensgenios.com/graphql")) {
        try {
          const json = JSON.parse(this.responseText);
          if (json?.data?.questions) {
            json.data.questions.forEach(q => {
              q.answers?.forEach(ans => {
                if (ans.fraction === 1) {
                  // Armazena na variável global
                  window.graphqlFraction1.push({
                    fraction: ans.fraction,
                    text: ans.text
                  });
                }
              });
            });
          }
        } catch (e) {}
      }
    });
    return origSend.apply(this, [body]);
  };
})();
