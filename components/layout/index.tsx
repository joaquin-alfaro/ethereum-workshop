import Header from './Header'
import Navbar from './Navbar'

interface LayoutType {
    children: React.ReactNode,
    title?: string,
    description?: string,
}
function Layout({ children, title, description }: LayoutType): JSX.Element {
    return (
        <div className='container'>
            <Header title={title} description={description}/>
            <main>
                <Navbar />
                <div className='container'>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout