import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useLocation } from 'react-router-dom'

import { isClashX, jsBridge } from '@lib/jsBridge'
import { Client } from '@lib/request'

const clashxConfigAtom = atom(async () => {
    if (!isClashX()) {
        return null
    }

    const info = await jsBridge!.getAPIInfo()
    return {
        secret: info.secret,
        server: `http://${info.host}:${info.port}`,
    }
})

export const localStorageAtom = atomWithStorage<
    Array<{
        server: string
        secret: string
    }>
>('externalControllers', [])

export function useAPIInfo() {
    const clashx = useAtomValue(clashxConfigAtom)
    const location = useLocation()
    const localStorage = useAtomValue(localStorageAtom)

    if (clashx != null) {
        return clashx
    }

    const qs = new URLSearchParams(location.search)

    const server =
        qs.get('server') ?? localStorage?.[0]?.server ?? 'http://127.0.0.1:9000'
    const secret = qs.get('secret') ?? localStorage?.[0]?.secret ?? ''

    return { server, secret }
}

const clientAtom = atom({
    key: '',
    instance: null as Client | null,
})

export function useClient() {
    const { server, secret } = useAPIInfo()

    const [item, setItem] = useAtom(clientAtom)
    const key = `${server}?secret=${secret}`

    if (item.key === key) {
        return item.instance!
    }

    const client = new Client(server, secret)
    setItem({ key, instance: client })

    return client
}
