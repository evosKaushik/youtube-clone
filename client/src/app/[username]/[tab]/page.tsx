type Props = { params: Promise<{ tab: string }> }

const TabPage = async ({ params }: Props) => {
    const { tab } = await params;
    return (
        <div>{tab}</div>
    )
}

export default TabPage
