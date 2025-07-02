import {useSearchParams} from "react-router-dom";
import {useMemo} from "react";

export function useQuery() {
    const [searchParams] = useSearchParams();

    const params = useMemo(() => {
        const paramsObj: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            paramsObj[key] = value;
        });
        return paramsObj;
    }, [searchParams]);

    return params;
}