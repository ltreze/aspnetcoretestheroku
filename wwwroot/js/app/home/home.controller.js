finleo.controller('HomeController', ['$scope', '$filter',  function ($scope, $filter) {
    window._m = $scope;
    var _m = window._m;

    $scope.categorias = [
        { nome: "Lazer", id: 1 },
        { nome: "Casa", id: 2 },
        { nome: "Transporte", id: 3 },
        { nome: "Educacao", id: 4 },
        { nome: "Outros", id: 5 },
        { nome: "Alimentacao", id: 6 }];

    var transacoesCarteira = [{
        id: 10,
        data: converterData(new Date(2019, 0, 1)),
        descricao: 'Mega Sena',
        categoria: { nome: 'Outros', id: 5 },
        outrasCategorias: function () { return obterOutras(this.categoria, $scope.categorias); },
        conta: { nome: 'Carteira', id: 1 },
        outrasContas: function () { return obterOutras(this.conta, $scope.contas); },
        valor: 7,
        mostrarBotaoExcluir: true,
        mostrarBotaoSalvar: false,
        mostrarBotaoCancelar: false
    }, {
        id: 11,
        data: converterData(new Date(2019, 0, 2)),
        descricao: 'Chocolate',
        categoria: { nome: 'Alimentacao', id: 6 },
        outrasCategorias: function () { return obterOutras(this.categoria, $scope.categorias); },
        conta: { nome: 'Carteira', id: 1 },
        outrasContas: function () { return obterOutras(this.conta, $scope.contas); },
        valor: 3,
        mostrarBotaoExcluir: true,
        mostrarBotaoSalvar: false,
        mostrarBotaoCancelar: false
        }];

    var transacoesCartaoCredito = [{
        id: 20,
        data: converterData(new Date(2019, 0, 1)),
        descricao: 'Barzinho',
        categoria: { nome: 'Lazer', id: 1 },
        outrasCategorias: function () { return obterOutras(this.categoria, $scope.categorias); },
        conta: { nome: 'Cartao de Credito', id: 2 },
        outrasContas: function () { return obterOutras(this.conta, $scope.contas); },
        valor: 123.45,
        mostrarBotaoExcluir: true,
        mostrarBotaoSalvar: false,
        mostrarBotaoCancelar: false
    }];

    var transacoesItau = [{
        id: 30,
        data: converterData(new Date(2019, 0, 3)),
        descricao: 'Kung Fu',
        categoria: { nome: 'Educacao', id: 4 },
        outrasCategorias: function () { return obterOutras(this.categoria, $scope.categorias); },
        conta: { nome: 'Itau', id: 3 },
        outrasContas: function () { return obterOutras(this.conta, $scope.contas); },
        valor: 100,
        mostrarBotaoExcluir: true,
        mostrarBotaoSalvar: false,
        mostrarBotaoCancelar: false
    }];

    $scope.contas = [
        {
            id: 1,
            nome: "Carteira",
            saldoInicial: 0,
            saldoAtual: 17,
            transacoes: transacoesCarteira,
            contaSelecionada: true
        },
        {
            id: 2,
            nome: "Cartao de Credito",
            saldoInicial: 0,
            saldoAtual: -3000,
            transacoes: transacoesCartaoCredito,
            contaSelecionada: true
        },
        {
            id: 3,
            nome: "Itau",
            saldoInicial: 0,
            saldoAtual: 10,
            transacoes: transacoesItau,
            contaSelecionada: true
        }];


    $scope.novaTransacaoEmEdicao = false;

    $scope.adicionaTransacao = function () {

        if ($scope.novaTransacaoEmEdicao) {
            $scope.mostraMsgNovaTransacaoEmEdicao = true;
            return;
        }

        $scope.transacoes.push({
            //id: novoId,
            data: converterData(new Date()),
            descricao: '',
            categoria: { nome: 'Escolha a categoria', id: 0 },
            outrasCategorias: function () { return obterOutras(this.categoria, $scope.categorias); },
            conta: { nome: 'Escolha a conta', id: 0 },
            outrasContas: function () { return obterOutras(this.conta, $scope.contas); },
            valor: 0.00,
            mostrarBotaoExcluir: false,
            mostrarBotaoSalvar: true,
            mostrarBotaoCancelar: true
        });

        $scope.novaTransacaoEmEdicao = true;
    };

    $scope.excluirTransacao = function (t) {

        //excluir transacao no backend..no callback cancelar:
        $scope.transacoes.splice($scope.transacoes.indexOf(t), 1);
        //$scope.cancelarTransacao(t);
    };

    $scope.cancelarTransacao = function (t) {
        $scope.transacoes.splice($scope.transacoes.indexOf(t), 1);
        $scope.novaTransacaoEmEdicao = false;
        $scope.mostraMsgNovaTransacaoEmEdicao = false;
    };

    $scope.transacoesOrdenadas = [];

    mergeTransacoes();


    //function obterTransacoesApi() {
    //    $http({
    //        method: 'GET',
    //        url: '/api/Values/obterTransacoes/'
    //    }).then(function (response) {
    //        $scope.listaTransacoes = response.data;
    //    }, function (error) {
    //        console.log(error);
    //    });
    //};

    //helpers
    function mergeTransacoes() {
        var mergeTransacoes = [];
        for (var i = 0; i < $scope.contas.length; i++) {
            var transacoes = $scope.contas[i].transacoes;
            mergeTransacoes = mergeTransacoes.concat(transacoes);
        }
        $scope.transacoesOrdenadas = $filter('orderBy')(mergeTransacoes, 'data');
    }

    function obterOutras(atual, todas) {
        var outras = [];
        for (var i = 0; i < todas.length; i++) {
            var outra = todas[i];
            if (outra.id !== atual.id) {
                outras.push(outra);
            }
        }
        return outras;
    }
    function converterData(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }
    function obterNovoId(colecao) {
        var ids = colecao.sort(function (a, b) {
            return a.id - b.id;
        });
        if (ids.length > 0)
            return ids[colecao.length - 1].id + 1;
    }
}]);
