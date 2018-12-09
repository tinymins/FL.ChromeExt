/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const login = (loadingText, account, password) => http.postForm('Public/checkLogin/', { account, password, ajax: 1 }, { loadingText });
export const logout = loadingText => http.get('Public/logout/', { loadingText });
export const getUser = loadingText => http.get('Public/profile/', { loadingText });
