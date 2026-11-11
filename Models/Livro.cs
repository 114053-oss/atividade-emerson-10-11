namespace BibliotecaApi.Models;

public class Livro : MaterialBiblioteca, IEmprestimo
{
    public string Autor { get; set; } = string.Empty;
    public int Paginas { get; set; }

    // Obrigatório porque na classe-base é abstract.
    // O cálculo do prazo fica dentro da classe (RN10).
    public override int CalcularPrazo()
    {
        return 14;
    }

    // Sobrescreve o método virtual da classe-base.
    public override string Descricao()
    {
        return $"Livro: {Titulo} - Autor: {Autor}";
    }

    // Método da interface IEmprestimo.
    // Reaproveita o CalcularPrazo() para informar os dias.
    public string Emprestar()
    {
        return $"O livro '{Titulo}' pode ser emprestado por {CalcularPrazo()} dias.";
    }
}
