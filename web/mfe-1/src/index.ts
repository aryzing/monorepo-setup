import {barOne} from '@aryzing/bar-pkg';
import {fooOne} from '@aryzing/foo-pkg'

export const main = () => {
    fooOne()
    barOne()

    return 'main-mfe-1'
}

main()