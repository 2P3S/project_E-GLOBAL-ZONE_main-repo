

export function test(url){
    const {loading, data, error} = useAxios({
        url
    })
    console.log(loading, data, error);
}