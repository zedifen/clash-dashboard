import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'

import { Modal, Input, Alert } from '@components'
import { useObject } from '@lib/hook'
import { useI18n, useAPIInfo, identityAtom } from '@stores'
import { localStorageAtom } from '@stores/request'
import './style.scss'

export default function ExternalController() {
    const { translation } = useI18n()
    const { t } = translation('Settings')
    const { server, secret } = useAPIInfo()
    const [identity, setIdentity] = useAtom(identityAtom)
    const [value, set] = useObject({
        server: '',
        secret: '',
    })

    useEffect(() => {
        set({ server, secret })
    }, [server, secret, set])

    const setter = useUpdateAtom(localStorageAtom)

    function handleOk() {
        const { server, secret } = value
        setter([{ server, secret }])
        setIdentity(true)
    }

    return (
        <Modal
            show={!identity}
            title={t('externalControllerSetting.title')}
            bodyClassName="external-controller"
            onClose={() => setIdentity(true)}
            onOk={handleOk}
        >
            <Alert type="info" inside={true}>
                <p>{t('externalControllerSetting.note')}</p>
            </Alert>
            <div className="flex items-center">
                <span className="font-bold my-1 w-14 md:my-3">
                    {t('externalControllerSetting.server')}
                </span>
                <Input
                    className="flex-1 my-1 md:my-3"
                    align="left"
                    inside={true}
                    value={value.server}
                    onChange={(server) => set('server', server)}
                    onEnter={handleOk}
                />
            </div>
            <div className="flex items-center">
                <div className="font-bold my-1 w-14 md:my-3">
                    {t('externalControllerSetting.secret')}
                </div>
                <Input
                    className="flex-1 my-1 w-14 md:my-3"
                    align="left"
                    inside={true}
                    value={value.secret}
                    onChange={(secret) => set('secret', secret)}
                    onEnter={handleOk}
                />
            </div>
        </Modal>
    )
}
