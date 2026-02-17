export const ColorDataInfoComp = ({ contrast_ratio, aatext, aaatext }: { contrast_ratio: string | number, aatext: boolean, aaatext: boolean }) => {
    return (
        <>
            <p>{`Ratio: ${contrast_ratio ?? "no ratio yet"}`}</p>
            <div className="flex-row">
                <p>{`AA Text: ${aatext ? "✅" : "❌"}`}</p>
                <p>{`AAA Text: ${aaatext ? "✅" : "❌"}`}</p>
            </div>
        </>
    )
}
export const UserColorDataInfoComp = ({ aatext, aaatext }: { aatext: boolean, aaatext: boolean }) => {
    return (
        <>
            <p>{`AA Text: ${aatext ? "✅" : "❌"}`}</p>
            <p>{`AAA Text: ${aaatext ? "✅" : "❌"}`}</p>
        </>
    )
}
