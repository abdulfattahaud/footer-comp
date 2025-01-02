const Layout = ({ children }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

export { Layout }
