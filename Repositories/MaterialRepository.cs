using BibliotecaApi.Models;

namespace BibliotecaApi.Repositories;

public class MaterialRepository : IMaterialRepository
{

    private readonly Dictionary<int, MaterialBiblioteca> _materiais = new Dictionary<int, MaterialBiblioteca>
    {
        { 1, new Livro { Id = 1, Titulo = "Clean Code", AnoPublicacao = 2008, Autor = "Robert C. Martin", Paginas = 464 } },
        { 2, new Revista { Id = 2, Titulo = "Tecnologia e Inovação", AnoPublicacao = 2026, Edicao = 15, MesPublicacao = 10 } }
    };

    private int GerarNovoId()
    {
        if (_materiais.Count == 0)
            return 1;

        return _materiais.Keys.Max() + 1;
    }

    public IEnumerable<MaterialBiblioteca> ObterTodos()
    {
        return _materiais.Values;
    }

    public MaterialBiblioteca? ObterPorId(int id)
    {
        if (!_materiais.ContainsKey(id))
            return null;

        return _materiais[id];
    }

    public MaterialBiblioteca Adicionar(MaterialBiblioteca material)
    {
        material.Id = GerarNovoId();
        _materiais.Add(material.Id, material);
        return material;
    }

    public bool Atualizar(int id, MaterialBiblioteca material)
    {
        if (!_materiais.ContainsKey(id))
            return false;

        material.Id = id;
        _materiais[id] = material;
        return true;
    }

    public bool Remover(int id)
    {
        return _materiais.Remove(id);
    }
}
