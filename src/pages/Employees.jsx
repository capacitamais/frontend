export default function Employees() {
    /**
     *Função buscar todos os elemntos
     *Função buscar elemento pelo id ao buscar pelo id, mostrar apenas o elemento pesquisado na lista 
     *Ao clicar sobre um item da lista abrir formulário para editá-lo
    */

    return (
        <>
            <div className="new-record">
                <div className="tag">Adicionar NomeEntidade</div>
                <button type="button">Adicionar</button>
            </div>
            <div className="search-record">
                <div className="tag">Buscar NomeEntidade</div>
                <input/>
                <button type="button">Buscar</button>
            </div>
            <div className="list">
                <div className="tag">Conteúdo</div>
                <ul>
                    <li>Registro da lista</li>
                    <li>Registro da lista</li>
                    <li>Registro da lista</li>
                </ul>
            </div>
        </>
    )
  }
  