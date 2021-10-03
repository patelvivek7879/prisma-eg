import { Input } from 'antd';

const SearchBox = (props) =>{
    const searchIt = (ev) =>{
      props.onSearch(ev);
    }
    return(
      <div>
        <label>Search : </label>
        <Input.Search style={{width: '50%'}} id="searchBox" onChange={searchIt} />
      </div>
    )
}

export default SearchBox;