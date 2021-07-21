import ConfigurationContext from '../contexts/ConfigurationContext'

export default (props)=>{
  
  return(
    <ConfigurationContext.Provider value={ props.configuration }>
      { props.children }
    </ConfigurationContext.Provider>
  )
}
