
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* node_modules/svelte-icons/components/IconBase.svelte generated by Svelte v3.44.3 */

    const file$r = "node_modules/svelte-icons/components/IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$9(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$r, 18, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$9(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$r, 16, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, if_block_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(svg, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconBase', slots, ['default']);
    	let { title = null } = $$props;
    	let { viewBox } = $$props;
    	const writable_props = ['title', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconBase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, viewBox, $$scope, slots];
    }

    class IconBase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*viewBox*/ ctx[1] === undefined && !('viewBox' in props)) {
    			console.warn("<IconBase> was created without expected prop 'viewBox'");
    		}
    	}

    	get title() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/fa/FaSearch.svelte generated by Svelte v3.44.3 */
    const file$q = "node_modules/svelte-icons/fa/FaSearch.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$c(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z");
    			add_location(path, file$q, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$c] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaSearch', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaSearch",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaRegBell.svelte generated by Svelte v3.44.3 */
    const file$p = "node_modules/svelte-icons/fa/FaRegBell.svelte";

    // (4:8) <IconBase viewBox="0 0 448 512" {...$$props}>
    function create_default_slot$b(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M439.39 362.29c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71zM67.53 368c21.22-27.97 44.42-74.33 44.53-159.42 0-.2-.06-.38-.06-.58 0-61.86 50.14-112 112-112s112 50.14 112 112c0 .2-.06.38-.06.58.11 85.1 23.31 131.46 44.53 159.42H67.53zM224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64z");
    			add_location(path, file$p, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 448 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 448 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$b] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaRegBell', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaRegBell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaRegBell",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaFacebookMessenger.svelte generated by Svelte v3.44.3 */
    const file$o = "node_modules/svelte-icons/fa/FaFacebookMessenger.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$a(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z");
    			add_location(path, file$o, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$a] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaFacebookMessenger', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaFacebookMessenger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaFacebookMessenger",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src/shared/Avatar.svelte generated by Svelte v3.44.3 */

    const file$n = "src/shared/Avatar.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-yo6w3z"));
    			add_location(div, file$n, 4, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-yo6w3z"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Avatar', slots, ['default']);
    	let { type } = $$props;
    	const writable_props = ['type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Avatar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, $$scope, slots];
    }

    class Avatar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { type: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatar",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !('type' in props)) {
    			console.warn("<Avatar> was created without expected prop 'type'");
    		}
    	}

    	get type() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.44.3 */
    const file$m = "src/components/Header.svelte";

    // (27:8) <Avatar type="small">
    function create_default_slot$9(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "img-avatar svelte-ta8vq");
    			if (!src_url_equal(img.src, img_src_value = "../musty-avatar.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$m, 27, 12, 689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(27:8) <Avatar type=\\\"small\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let header;
    	let div1;
    	let div0;
    	let fasearch;
    	let t0;
    	let input;
    	let t1;
    	let div4;
    	let div2;
    	let faregbell;
    	let t2;
    	let div3;
    	let fafacebookmessenger;
    	let t3;
    	let avatar;
    	let current;
    	fasearch = new FaSearch({ $$inline: true });
    	faregbell = new FaRegBell({ $$inline: true });
    	fafacebookmessenger = new FaFacebookMessenger({ $$inline: true });

    	avatar = new Avatar({
    			props: {
    				type: "small",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fasearch.$$.fragment);
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			div4 = element("div");
    			div2 = element("div");
    			create_component(faregbell.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(fafacebookmessenger.$$.fragment);
    			t3 = space();
    			create_component(avatar.$$.fragment);
    			attr_dev(div0, "class", "search-icon svelte-ta8vq");
    			add_location(div0, file$m, 10, 8, 318);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search here..");
    			attr_dev(input, "class", "svelte-ta8vq");
    			add_location(input, file$m, 14, 8, 393);
    			attr_dev(div1, "class", "text-field svelte-ta8vq");
    			add_location(div1, file$m, 9, 4, 285);
    			attr_dev(div2, "class", "noti-icon svelte-ta8vq");
    			add_location(div2, file$m, 18, 8, 485);
    			attr_dev(div3, "class", "noti-icon svelte-ta8vq");
    			add_location(div3, file$m, 22, 8, 567);
    			attr_dev(div4, "class", "right svelte-ta8vq");
    			add_location(div4, file$m, 17, 4, 457);
    			attr_dev(header, "class", "svelte-ta8vq");
    			add_location(header, file$m, 8, 0, 272);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, div0);
    			mount_component(fasearch, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, input);
    			append_dev(header, t1);
    			append_dev(header, div4);
    			append_dev(div4, div2);
    			mount_component(faregbell, div2, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			mount_component(fafacebookmessenger, div3, null);
    			append_dev(div4, t3);
    			mount_component(avatar, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const avatar_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				avatar_changes.$$scope = { dirty, ctx };
    			}

    			avatar.$set(avatar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fasearch.$$.fragment, local);
    			transition_in(faregbell.$$.fragment, local);
    			transition_in(fafacebookmessenger.$$.fragment, local);
    			transition_in(avatar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fasearch.$$.fragment, local);
    			transition_out(faregbell.$$.fragment, local);
    			transition_out(fafacebookmessenger.$$.fragment, local);
    			transition_out(avatar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(fasearch);
    			destroy_component(faregbell);
    			destroy_component(fafacebookmessenger);
    			destroy_component(avatar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FaSearch,
    		FaRegBell,
    		FaFacebookMessenger,
    		Avatar
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/shared/Vertical.svelte generated by Svelte v3.44.3 */

    const file$l = "src/shared/Vertical.svelte";

    function create_fragment$m(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "vl svelte-9vk928");
    			add_location(div, file$l, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Vertical', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Vertical> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Vertical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Vertical",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaHome.svelte generated by Svelte v3.44.3 */
    const file$k = "node_modules/svelte-icons/fa/FaHome.svelte";

    // (4:8) <IconBase viewBox="0 0 576 512" {...$$props}>
    function create_default_slot$8(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z");
    			add_location(path, file$k, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 576 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 576 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$8] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaHome', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaHome extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaHome",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/Nav.svelte generated by Svelte v3.44.3 */

    const { console: console_1$8 } = globals;
    const file$j = "src/components/Nav.svelte";

    function create_fragment$k(ctx) {
    	let main;
    	let div0;
    	let t1;
    	let div5;
    	let a0;
    	let div1;
    	let fahome0;
    	let t2;
    	let p0;
    	let t4;
    	let a1;
    	let div2;
    	let fahome1;
    	let t5;
    	let p1;
    	let t7;
    	let a2;
    	let div3;
    	let fahome2;
    	let t8;
    	let p2;
    	let t10;
    	let a3;
    	let div4;
    	let fahome3;
    	let t11;
    	let p3;
    	let current;
    	fahome0 = new FaHome({ $$inline: true });
    	fahome1 = new FaHome({ $$inline: true });
    	fahome2 = new FaHome({ $$inline: true });
    	fahome3 = new FaHome({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			div0.textContent = "TRACKER";
    			t1 = space();
    			div5 = element("div");
    			a0 = element("a");
    			div1 = element("div");
    			create_component(fahome0.$$.fragment);
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Dashboard";
    			t4 = space();
    			a1 = element("a");
    			div2 = element("div");
    			create_component(fahome1.$$.fragment);
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Profile";
    			t7 = space();
    			a2 = element("a");
    			div3 = element("div");
    			create_component(fahome2.$$.fragment);
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "Add Vehicle";
    			t10 = space();
    			a3 = element("a");
    			div4 = element("div");
    			create_component(fahome3.$$.fragment);
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "Logout";
    			attr_dev(div0, "class", "logo svelte-fvz03e");
    			add_location(div0, file$j, 11, 4, 242);
    			attr_dev(div1, "class", "icon svelte-fvz03e");
    			toggle_class(div1, "active-color", /*activeHome*/ ctx[0] == true);
    			add_location(div1, file$j, 17, 12, 400);
    			attr_dev(p0, "class", "text svelte-fvz03e");
    			toggle_class(p0, "active-color", /*activeHome*/ ctx[0] == true);
    			add_location(p0, file$j, 20, 12, 516);
    			attr_dev(a0, "class", "link svelte-fvz03e");
    			attr_dev(a0, "href", "/dashboard");
    			toggle_class(a0, "active", /*activeHome*/ ctx[0] == true);
    			add_location(a0, file$j, 16, 8, 319);
    			attr_dev(div2, "class", "icon svelte-fvz03e");
    			toggle_class(div2, "active-color", /*activeProfile*/ ctx[2]);
    			add_location(div2, file$j, 27, 12, 719);
    			attr_dev(p1, "class", "text svelte-fvz03e");
    			toggle_class(p1, "active-color", /*activeProfile*/ ctx[2]);
    			add_location(p1, file$j, 30, 12, 830);
    			attr_dev(a1, "class", "link svelte-fvz03e");
    			attr_dev(a1, "href", "/staff-profile");
    			toggle_class(a1, "active", /*activeProfile*/ ctx[2]);
    			add_location(a1, file$j, 26, 8, 639);
    			attr_dev(div3, "class", "icon svelte-fvz03e");
    			toggle_class(div3, "active-color", /*activeAddVehicle*/ ctx[1]);
    			add_location(div3, file$j, 36, 12, 1026);
    			attr_dev(p2, "class", "text svelte-fvz03e");
    			toggle_class(p2, "active-color", /*activeAddVehicle*/ ctx[1]);
    			add_location(p2, file$j, 39, 12, 1140);
    			attr_dev(a2, "class", "link svelte-fvz03e");
    			attr_dev(a2, "href", "/add-vehicle");
    			toggle_class(a2, "active", /*activeAddVehicle*/ ctx[1]);
    			add_location(a2, file$j, 35, 8, 945);
    			attr_dev(div4, "class", "icon svelte-fvz03e");
    			toggle_class(div4, "active-color", /*active*/ ctx[3]);
    			add_location(div4, file$j, 47, 12, 1337);
    			attr_dev(p3, "class", "text svelte-fvz03e");
    			toggle_class(p3, "active-color", /*active*/ ctx[3]);
    			add_location(p3, file$j, 50, 12, 1441);
    			attr_dev(a3, "class", "link svelte-fvz03e");
    			attr_dev(a3, "href", "/login");
    			toggle_class(a3, "active", /*active*/ ctx[3]);
    			add_location(a3, file$j, 46, 8, 1272);
    			attr_dev(div5, "class", "nav svelte-fvz03e");
    			add_location(div5, file$j, 15, 4, 293);
    			attr_dev(main, "class", "svelte-fvz03e");
    			add_location(main, file$j, 10, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t1);
    			append_dev(main, div5);
    			append_dev(div5, a0);
    			append_dev(a0, div1);
    			mount_component(fahome0, div1, null);
    			append_dev(a0, t2);
    			append_dev(a0, p0);
    			append_dev(div5, t4);
    			append_dev(div5, a1);
    			append_dev(a1, div2);
    			mount_component(fahome1, div2, null);
    			append_dev(a1, t5);
    			append_dev(a1, p1);
    			append_dev(div5, t7);
    			append_dev(div5, a2);
    			append_dev(a2, div3);
    			mount_component(fahome2, div3, null);
    			append_dev(a2, t8);
    			append_dev(a2, p2);
    			append_dev(div5, t10);
    			append_dev(div5, a3);
    			append_dev(a3, div4);
    			mount_component(fahome3, div4, null);
    			append_dev(a3, t11);
    			append_dev(a3, p3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeHome*/ 1) {
    				toggle_class(div1, "active-color", /*activeHome*/ ctx[0] == true);
    			}

    			if (dirty & /*activeHome*/ 1) {
    				toggle_class(p0, "active-color", /*activeHome*/ ctx[0] == true);
    			}

    			if (dirty & /*activeHome*/ 1) {
    				toggle_class(a0, "active", /*activeHome*/ ctx[0] == true);
    			}

    			if (dirty & /*activeProfile*/ 4) {
    				toggle_class(div2, "active-color", /*activeProfile*/ ctx[2]);
    			}

    			if (dirty & /*activeProfile*/ 4) {
    				toggle_class(p1, "active-color", /*activeProfile*/ ctx[2]);
    			}

    			if (dirty & /*activeProfile*/ 4) {
    				toggle_class(a1, "active", /*activeProfile*/ ctx[2]);
    			}

    			if (dirty & /*activeAddVehicle*/ 2) {
    				toggle_class(div3, "active-color", /*activeAddVehicle*/ ctx[1]);
    			}

    			if (dirty & /*activeAddVehicle*/ 2) {
    				toggle_class(p2, "active-color", /*activeAddVehicle*/ ctx[1]);
    			}

    			if (dirty & /*activeAddVehicle*/ 2) {
    				toggle_class(a2, "active", /*activeAddVehicle*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fahome0.$$.fragment, local);
    			transition_in(fahome1.$$.fragment, local);
    			transition_in(fahome2.$$.fragment, local);
    			transition_in(fahome3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fahome0.$$.fragment, local);
    			transition_out(fahome1.$$.fragment, local);
    			transition_out(fahome2.$$.fragment, local);
    			transition_out(fahome3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(fahome0);
    			destroy_component(fahome1);
    			destroy_component(fahome2);
    			destroy_component(fahome3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	let { activeHome = false } = $$props;
    	let { activeAddVehicle = false } = $$props;
    	let { activeProfile = false } = $$props;
    	let active = false;
    	console.log(active);
    	const writable_props = ['activeHome', 'activeAddVehicle', 'activeProfile'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('activeHome' in $$props) $$invalidate(0, activeHome = $$props.activeHome);
    		if ('activeAddVehicle' in $$props) $$invalidate(1, activeAddVehicle = $$props.activeAddVehicle);
    		if ('activeProfile' in $$props) $$invalidate(2, activeProfile = $$props.activeProfile);
    	};

    	$$self.$capture_state = () => ({
    		FaHome,
    		activeHome,
    		activeAddVehicle,
    		activeProfile,
    		active
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeHome' in $$props) $$invalidate(0, activeHome = $$props.activeHome);
    		if ('activeAddVehicle' in $$props) $$invalidate(1, activeAddVehicle = $$props.activeAddVehicle);
    		if ('activeProfile' in $$props) $$invalidate(2, activeProfile = $$props.activeProfile);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeHome, activeAddVehicle, activeProfile, active];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			activeHome: 0,
    			activeAddVehicle: 1,
    			activeProfile: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get activeHome() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeHome(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeAddVehicle() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeAddVehicle(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeProfile() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeProfile(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const user = writable(null);
    const vehicleStore = writable(null);
    const rLocation = writable(null);
    const rLocationTime = writable(null);

    /* src/shared/Table.svelte generated by Svelte v3.44.3 */

    const { console: console_1$7 } = globals;
    const file$i = "src/shared/Table.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (50:10) {:else}
    function create_else_block$7(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "..loading";
    			attr_dev(p, "class", "svelte-1hxnw1c");
    			add_location(p, file$i, 50, 10, 1588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(50:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:10) {#if $user}
    function create_if_block$8(ctx) {
    	let each_1_anchor;
    	let each_value = /*$user*/ ctx[0].vehicle;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*vehicleHandler, $user*/ 3) {
    				each_value = /*$user*/ ctx[0].vehicle;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(37:10) {#if $user}",
    		ctx
    	});

    	return block;
    }

    // (39:12) {#each $user.vehicle as vehicle, ind}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*ind*/ ctx[7] + 1 + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*vehicle*/ ctx[5].vehicleName + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*vehicle*/ ctx[5].brandName + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*vehicle*/ ctx[5].color + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*vehicle*/ ctx[5].yearOfPurchase + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*vehicle*/ ctx[5].vehicleId + "";
    	let t10;
    	let t11;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*vehicle*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			attr_dev(td0, "class", "td svelte-1hxnw1c");
    			add_location(td0, file$i, 40, 16, 1206);
    			attr_dev(td1, "class", "td svelte-1hxnw1c");
    			add_location(td1, file$i, 41, 16, 1252);
    			attr_dev(td2, "class", "td svelte-1hxnw1c");
    			add_location(td2, file$i, 42, 16, 1310);
    			attr_dev(td3, "class", "td svelte-1hxnw1c");
    			add_location(td3, file$i, 43, 16, 1366);
    			attr_dev(td4, "class", "td svelte-1hxnw1c");
    			add_location(td4, file$i, 44, 16, 1418);
    			attr_dev(td5, "class", "td svelte-1hxnw1c");
    			add_location(td5, file$i, 45, 16, 1479);
    			attr_dev(tr, "class", "tr svelte-1hxnw1c");
    			add_location(tr, file$i, 39, 14, 1135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);

    			if (!mounted) {
    				dispose = listen_dev(tr, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$user*/ 1 && t2_value !== (t2_value = /*vehicle*/ ctx[5].vehicleName + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$user*/ 1 && t4_value !== (t4_value = /*vehicle*/ ctx[5].brandName + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$user*/ 1 && t6_value !== (t6_value = /*vehicle*/ ctx[5].color + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$user*/ 1 && t8_value !== (t8_value = /*vehicle*/ ctx[5].yearOfPurchase + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*$user*/ 1 && t10_value !== (t10_value = /*vehicle*/ ctx[5].vehicleId + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(39:12) {#each $user.vehicle as vehicle, ind}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let main;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[0]) return create_if_block$8;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "S/N";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "VEHICLE NAME";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "BRAND";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "COLOR";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "PURCHASE DATE";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "ID";
    			t11 = space();
    			tbody = element("tbody");
    			if_block.c();
    			attr_dev(th0, "class", "header svelte-1hxnw1c");
    			add_location(th0, file$i, 27, 12, 749);
    			attr_dev(th1, "class", "header svelte-1hxnw1c");
    			add_location(th1, file$i, 28, 12, 789);
    			attr_dev(th2, "class", "header svelte-1hxnw1c");
    			add_location(th2, file$i, 29, 12, 838);
    			attr_dev(th3, "class", "header svelte-1hxnw1c");
    			add_location(th3, file$i, 30, 12, 880);
    			attr_dev(th4, "class", "header svelte-1hxnw1c");
    			add_location(th4, file$i, 31, 12, 922);
    			attr_dev(th5, "class", "header svelte-1hxnw1c");
    			add_location(th5, file$i, 32, 12, 972);
    			attr_dev(tr, "class", "svelte-1hxnw1c");
    			add_location(tr, file$i, 26, 10, 732);
    			attr_dev(thead, "class", "svelte-1hxnw1c");
    			add_location(thead, file$i, 25, 8, 714);
    			attr_dev(tbody, "class", "svelte-1hxnw1c");
    			add_location(tbody, file$i, 35, 8, 1040);
    			attr_dev(table, "class", "zigzag svelte-1hxnw1c");
    			add_location(table, file$i, 24, 4, 683);
    			attr_dev(main, "class", "svelte-1hxnw1c");
    			add_location(main, file$i, 23, 0, 672);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(table, t11);
    			append_dev(table, tbody);
    			if_block.m(tbody, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(tbody, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $vehicleStore;
    	let $user;
    	validate_store(vehicleStore, 'vehicleStore');
    	component_subscribe($$self, vehicleStore, $$value => $$invalidate(4, $vehicleStore = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(0, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	localStorage.removeItem('vehicle');

    	// console.log($user.vehicle)
    	let userLocalStorage;

    	beforeUpdate(() => {
    		userLocalStorage = JSON.parse(localStorage.getItem('user'));
    		console.log(userLocalStorage);
    		user.set(userLocalStorage);
    	});

    	const vehicleHandler = async vehicle => {
    		console.log(vehicle);
    		vehicleStore.set(vehicle);
    		let gg = localStorage.setItem('vehicle', JSON.stringify(vehicle));
    		console.log($vehicleStore, gg);
    		page.redirect('/vehicle-detail');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	const click_handler = vehicle => vehicleHandler(vehicle);

    	$$self.$capture_state = () => ({
    		vehicleStore,
    		user,
    		router: page,
    		beforeUpdate,
    		userLocalStorage,
    		vehicleHandler,
    		$vehicleStore,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('userLocalStorage' in $$props) userLocalStorage = $$props.userLocalStorage;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$user, vehicleHandler, click_handler];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/shared/loader/SpinnerLoader.svelte generated by Svelte v3.44.3 */

    const file$h = "src/shared/loader/SpinnerLoader.svelte";

    function create_fragment$i(ctx) {
    	let div12;
    	let div0;
    	let div1;
    	let div2;
    	let div3;
    	let div4;
    	let div5;
    	let div6;
    	let div7;
    	let div8;
    	let div9;
    	let div10;
    	let div11;

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div0 = element("div");
    			div1 = element("div");
    			div2 = element("div");
    			div3 = element("div");
    			div4 = element("div");
    			div5 = element("div");
    			div6 = element("div");
    			div7 = element("div");
    			div8 = element("div");
    			div9 = element("div");
    			div10 = element("div");
    			div11 = element("div");
    			attr_dev(div0, "class", "svelte-1tdz0zp");
    			add_location(div0, file$h, 0, 25, 25);
    			attr_dev(div1, "class", "svelte-1tdz0zp");
    			add_location(div1, file$h, 0, 36, 36);
    			attr_dev(div2, "class", "svelte-1tdz0zp");
    			add_location(div2, file$h, 0, 47, 47);
    			attr_dev(div3, "class", "svelte-1tdz0zp");
    			add_location(div3, file$h, 0, 58, 58);
    			attr_dev(div4, "class", "svelte-1tdz0zp");
    			add_location(div4, file$h, 0, 69, 69);
    			attr_dev(div5, "class", "svelte-1tdz0zp");
    			add_location(div5, file$h, 0, 80, 80);
    			attr_dev(div6, "class", "svelte-1tdz0zp");
    			add_location(div6, file$h, 0, 91, 91);
    			attr_dev(div7, "class", "svelte-1tdz0zp");
    			add_location(div7, file$h, 0, 102, 102);
    			attr_dev(div8, "class", "svelte-1tdz0zp");
    			add_location(div8, file$h, 0, 113, 113);
    			attr_dev(div9, "class", "svelte-1tdz0zp");
    			add_location(div9, file$h, 0, 124, 124);
    			attr_dev(div10, "class", "svelte-1tdz0zp");
    			add_location(div10, file$h, 0, 135, 135);
    			attr_dev(div11, "class", "svelte-1tdz0zp");
    			add_location(div11, file$h, 0, 146, 146);
    			attr_dev(div12, "class", "lds-spinner svelte-1tdz0zp");
    			add_location(div12, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div0);
    			append_dev(div12, div1);
    			append_dev(div12, div2);
    			append_dev(div12, div3);
    			append_dev(div12, div4);
    			append_dev(div12, div5);
    			append_dev(div12, div6);
    			append_dev(div12, div7);
    			append_dev(div12, div8);
    			append_dev(div12, div9);
    			append_dev(div12, div10);
    			append_dev(div12, div11);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpinnerLoader', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpinnerLoader> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SpinnerLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpinnerLoader",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/Home.svelte generated by Svelte v3.44.3 */

    const { console: console_1$6 } = globals;
    const file$g = "src/components/Home.svelte";

    function create_fragment$h(ctx) {
    	let div1;
    	let nav;
    	let t0;
    	let vertical;
    	let t1;
    	let div0;
    	let header;
    	let t2;
    	let table;
    	let current;

    	nav = new Nav({
    			props: { activeHome: true },
    			$$inline: true
    		});

    	vertical = new Vertical({ $$inline: true });
    	header = new Header({ $$inline: true });
    	table = new Table({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(vertical.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(header.$$.fragment);
    			t2 = space();
    			create_component(table.$$.fragment);
    			attr_dev(div0, "class", "align svelte-stb7ye");
    			add_location(div0, file$g, 29, 4, 701);
    			attr_dev(div1, "class", "main svelte-stb7ye");
    			add_location(div1, file$g, 24, 0, 643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(nav, div1, null);
    			append_dev(div1, t0);
    			mount_component(vertical, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(header, div0, null);
    			append_dev(div0, t2);
    			mount_component(table, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(vertical.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(vertical.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(nav);
    			destroy_component(vertical);
    			destroy_component(header);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	console.log($user);
    	var pusher = new Pusher('9468633eaae788047980', { cluster: 'mt1' });
    	var channel = pusher.subscribe('my-channel');

    	channel.bind('my-event', function (data) {
    		user.set(data.user);
    		localStorage.setItem('user', JSON.stringify(data.user));
    		console.log(data.user);
    	});

    	let { active } = $$props;
    	let activeHome = active;
    	const writable_props = ['active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Vertical,
    		Nav,
    		Table,
    		SpinnerLoader,
    		user,
    		pusher,
    		channel,
    		active,
    		activeHome,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('pusher' in $$props) pusher = $$props.pusher;
    		if ('channel' in $$props) channel = $$props.channel;
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('activeHome' in $$props) activeHome = $$props.activeHome;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { active: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*active*/ ctx[0] === undefined && !('active' in props)) {
    			console_1$6.warn("<Home> was created without expected prop 'active'");
    		}
    	}

    	get active() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/fa/FaRegUser.svelte generated by Svelte v3.44.3 */
    const file$f = "node_modules/svelte-icons/fa/FaRegUser.svelte";

    // (4:8) <IconBase viewBox="0 0 448 512" {...$$props}>
    function create_default_slot$7(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z");
    			add_location(path, file$f, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 448 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 448 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaRegUser', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaRegUser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaRegUser",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules/smelte/src/components/Icon/Icon.svelte generated by Svelte v3.44.3 */

    const file$e = "node_modules/smelte/src/components/Icon/Icon.svelte";

    function create_fragment$f(ctx) {
    	let i;
    	let i_class_value;
    	let i_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (default_slot) default_slot.c();
    			attr_dev(i, "aria-hidden", "true");
    			attr_dev(i, "class", i_class_value = "material-icons icon text-xl select-none " + /*$$props*/ ctx[5].class + " duration-200 ease-in" + " svelte-zzky5a");
    			attr_dev(i, "style", i_style_value = /*color*/ ctx[4] ? `color: ${/*color*/ ctx[4]}` : '');
    			toggle_class(i, "reverse", /*reverse*/ ctx[2]);
    			toggle_class(i, "tip", /*tip*/ ctx[3]);
    			toggle_class(i, "text-base", /*small*/ ctx[0]);
    			toggle_class(i, "text-xs", /*xs*/ ctx[1]);
    			add_location(i, file$e, 20, 0, 273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (default_slot) {
    				default_slot.m(i, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(i, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*$$props*/ 32 && i_class_value !== (i_class_value = "material-icons icon text-xl select-none " + /*$$props*/ ctx[5].class + " duration-200 ease-in" + " svelte-zzky5a")) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (!current || dirty & /*color*/ 16 && i_style_value !== (i_style_value = /*color*/ ctx[4] ? `color: ${/*color*/ ctx[4]}` : '')) {
    				attr_dev(i, "style", i_style_value);
    			}

    			if (dirty & /*$$props, reverse*/ 36) {
    				toggle_class(i, "reverse", /*reverse*/ ctx[2]);
    			}

    			if (dirty & /*$$props, tip*/ 40) {
    				toggle_class(i, "tip", /*tip*/ ctx[3]);
    			}

    			if (dirty & /*$$props, small*/ 33) {
    				toggle_class(i, "text-base", /*small*/ ctx[0]);
    			}

    			if (dirty & /*$$props, xs*/ 34) {
    				toggle_class(i, "text-xs", /*xs*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, ['default']);
    	let { small = false } = $$props;
    	let { xs = false } = $$props;
    	let { reverse = false } = $$props;
    	let { tip = false } = $$props;
    	let { color = "default" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('small' in $$new_props) $$invalidate(0, small = $$new_props.small);
    		if ('xs' in $$new_props) $$invalidate(1, xs = $$new_props.xs);
    		if ('reverse' in $$new_props) $$invalidate(2, reverse = $$new_props.reverse);
    		if ('tip' in $$new_props) $$invalidate(3, tip = $$new_props.tip);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ small, xs, reverse, tip, color });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('small' in $$props) $$invalidate(0, small = $$new_props.small);
    		if ('xs' in $$props) $$invalidate(1, xs = $$new_props.xs);
    		if ('reverse' in $$props) $$invalidate(2, reverse = $$new_props.reverse);
    		if ('tip' in $$props) $$invalidate(3, tip = $$new_props.tip);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [small, xs, reverse, tip, color, $$props, $$scope, slots, click_handler];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			small: 0,
    			xs: 1,
    			reverse: 2,
    			tip: 3,
    			color: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get small() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reverse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reverse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const noDepth = ["white", "black", "transparent"];

    function getClass(prop, color, depth, defaultDepth) {
      if (noDepth.includes(color)) {
        return `${prop}-${color}`;
      }
      return `${prop}-${color}-${depth || defaultDepth} `;
    }

    function utils(color, defaultDepth = 500) {
      return {
        bg: depth => getClass("bg", color, depth, defaultDepth),
        border: depth => getClass("border", color, depth, defaultDepth),
        txt: depth => getClass("text", color, depth, defaultDepth),
        caret: depth => getClass("caret", color, depth, defaultDepth)
      };
    }

    class ClassBuilder {
      constructor(classes, defaultClasses) {
        this.defaults =
          (typeof classes === "function" ? classes(defaultClasses) : classes) ||
          defaultClasses;

        this.classes = this.defaults;
      }

      flush() {
        this.classes = this.defaults;

        return this;
      }

      extend(...fns) {
        return this;
      }

      get() {
        return this.classes;
      }

      replace(classes, cond = true) {
        if (cond && classes) {
          this.classes = Object.keys(classes).reduce(
            (acc, from) => acc.replace(new RegExp(from, "g"), classes[from]),
            this.classes
          );
        }

        return this;
      }

      remove(classes, cond = true) {
        if (cond && classes) {
          this.classes = classes
            .split(" ")
            .reduce(
              (acc, cur) => acc.replace(new RegExp(cur, "g"), ""),
              this.classes
            );
        }

        return this;
      }

      add(className, cond = true, defaultValue) {
        if (!cond || !className) return this;

        switch (typeof className) {
          case "string":
          default:
            this.classes += ` ${className} `;
            return this;
          case "function":
            this.classes += ` ${className(defaultValue || this.classes)} `;
            return this;
        }
      }
    }

    const defaultReserved = ["class", "add", "remove", "replace", "value"];

    function filterProps(reserved, props) {
      const r = [...reserved, ...defaultReserved];

      return Object.keys(props).reduce(
        (acc, cur) =>
          cur.includes("$$") || cur.includes("Class") || r.includes(cur)
            ? acc
            : { ...acc, [cur]: props[cur] },
        {}
      );
    }

    // Thanks Lagden! https://svelte.dev/repl/61d9178d2b9944f2aa2bfe31612ab09f?version=3.6.7
    function ripple(color, centered) {
      return function(event) {
        const target = event.currentTarget;
        const circle = document.createElement("span");
        const d = Math.max(target.clientWidth, target.clientHeight);

        const removeCircle = () => {
          circle.remove();
          circle.removeEventListener("animationend", removeCircle);
        };

        circle.addEventListener("animationend", removeCircle);
        circle.style.width = circle.style.height = `${d}px`;
        const rect = target.getBoundingClientRect();

        if (centered) {
          circle.classList.add(
            "absolute",
            "top-0",
            "left-0",
            "ripple-centered",
            `bg-${color}-transDark`
          );
        } else {
          circle.style.left = `${event.clientX - rect.left - d / 2}px`;
          circle.style.top = `${event.clientY - rect.top - d / 2}px`;

          circle.classList.add("ripple-normal", `bg-${color}-trans`);
        }

        circle.classList.add("ripple");

        target.appendChild(circle);
      };
    }

    function r(color = "primary", centered = false) {
      return function(node) {
        const onMouseDown = ripple(color, centered);
        node.addEventListener("mousedown", onMouseDown);

        return {
          onDestroy: () => node.removeEventListener("mousedown", onMouseDown),
        };
      };
    }

    /* node_modules/smelte/src/components/Button/Button.svelte generated by Svelte v3.44.3 */
    const file$d = "node_modules/smelte/src/components/Button/Button.svelte";

    // (153:0) {:else}
    function create_else_block$6(ctx) {
    	let button;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*icon*/ ctx[3] && create_if_block_2$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[34].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[43], null);

    	let button_levels = [
    		{ class: /*classes*/ ctx[1] },
    		/*props*/ ctx[9],
    		{ type: /*type*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[2] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$d, 153, 2, 4075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*ripple*/ ctx[8].call(null, button)),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[42], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[38], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_1*/ ctx[39], false, false, false),
    					listen_dev(button, "*", /*_handler_1*/ ctx[40], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*icon*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*icon*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[43], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty[0] & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				/*props*/ ctx[9],
    				(!current || dirty[0] & /*type*/ 64) && { type: /*type*/ ctx[6] },
    				(!current || dirty[0] & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(153:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (131:0) {#if href}
    function create_if_block$7(ctx) {
    	let a;
    	let button;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*icon*/ ctx[3] && create_if_block_1$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[34].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[43], null);

    	let button_levels = [
    		{ class: /*classes*/ ctx[1] },
    		/*props*/ ctx[9],
    		{ type: /*type*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[2] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	let a_levels = [{ href: /*href*/ ctx[5] }, /*props*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$d, 135, 4, 3762);
    			set_attributes(a, a_data);
    			add_location(a, file$d, 131, 2, 3725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, button);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*ripple*/ ctx[8].call(null, button)),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[41], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[35], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[36], false, false, false),
    					listen_dev(button, "*", /*_handler*/ ctx[37], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*icon*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*icon*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[43], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty[0] & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				/*props*/ ctx[9],
    				(!current || dirty[0] & /*type*/ 64) && { type: /*type*/ ctx[6] },
    				(!current || dirty[0] & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] }
    			]));

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty[0] & /*href*/ 32) && { href: /*href*/ ctx[5] },
    				/*props*/ ctx[9]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(131:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (165:4) {#if icon}
    function create_if_block_2$2(ctx) {
    	let icon_1;
    	let current;

    	icon_1 = new Icon({
    			props: {
    				class: /*iClasses*/ ctx[7],
    				small: /*small*/ ctx[4],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*iClasses*/ 128) icon_1_changes.class = /*iClasses*/ ctx[7];
    			if (dirty[0] & /*small*/ 16) icon_1_changes.small = /*small*/ ctx[4];

    			if (dirty[0] & /*icon*/ 8 | dirty[1] & /*$$scope*/ 4096) {
    				icon_1_changes.$$scope = { dirty, ctx };
    			}

    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(165:4) {#if icon}",
    		ctx
    	});

    	return block_1;
    }

    // (166:6) <Icon class={iClasses} {small}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*icon*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*icon*/ 8) set_data_dev(t, /*icon*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(166:6) <Icon class={iClasses} {small}>",
    		ctx
    	});

    	return block_1;
    }

    // (147:6) {#if icon}
    function create_if_block_1$3(ctx) {
    	let icon_1;
    	let current;

    	icon_1 = new Icon({
    			props: {
    				class: /*iClasses*/ ctx[7],
    				small: /*small*/ ctx[4],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*iClasses*/ 128) icon_1_changes.class = /*iClasses*/ ctx[7];
    			if (dirty[0] & /*small*/ 16) icon_1_changes.small = /*small*/ ctx[4];

    			if (dirty[0] & /*icon*/ 8 | dirty[1] & /*$$scope*/ 4096) {
    				icon_1_changes.$$scope = { dirty, ctx };
    			}

    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(147:6) {#if icon}",
    		ctx
    	});

    	return block_1;
    }

    // (148:8) <Icon class={iClasses} {small}>
    function create_default_slot$6(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*icon*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*icon*/ 8) set_data_dev(t, /*icon*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(148:8) <Icon class={iClasses} {small}>",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    const classesDefault$1 = 'z-10 py-2 px-4 uppercase text-sm font-medium relative overflow-hidden';
    const basicDefault = 'text-white duration-200 ease-in';
    const outlinedDefault = 'bg-transparent border border-solid';
    const textDefault = 'bg-transparent border-none px-4 hover:bg-transparent';
    const iconDefault = 'p-4 flex items-center select-none';
    const fabDefault = 'hover:bg-transparent';
    const smallDefault = 'pt-1 pb-1 pl-2 pr-2 text-xs';
    const disabledDefault = 'bg-gray-300 text-gray-500 dark:bg-dark-400 pointer-events-none hover:bg-gray-300 cursor-default';
    const elevationDefault = 'hover:shadow shadow';

    function instance$e($$self, $$props, $$invalidate) {
    	let normal;
    	let lighter;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { value = false } = $$props;
    	let { outlined = false } = $$props;
    	let { text = false } = $$props;
    	let { block = false } = $$props;
    	let { disabled = false } = $$props;
    	let { icon = null } = $$props;
    	let { small = false } = $$props;
    	let { light = false } = $$props;
    	let { dark = false } = $$props;
    	let { flat = false } = $$props;
    	let { iconClass = "" } = $$props;
    	let { color = "primary" } = $$props;
    	let { href = null } = $$props;
    	let { fab = false } = $$props;
    	let { type = "button" } = $$props;
    	let { remove = "" } = $$props;
    	let { add = "" } = $$props;
    	let { replace = {} } = $$props;
    	let { classes = classesDefault$1 } = $$props;
    	let { basicClasses = basicDefault } = $$props;
    	let { outlinedClasses = outlinedDefault } = $$props;
    	let { textClasses = textDefault } = $$props;
    	let { iconClasses = iconDefault } = $$props;
    	let { fabClasses = fabDefault } = $$props;
    	let { smallClasses = smallDefault } = $$props;
    	let { disabledClasses = disabledDefault } = $$props;
    	let { elevationClasses = elevationDefault } = $$props;
    	fab = fab || text && icon;
    	const basic = !outlined && !text && !fab;
    	const elevation = (basic || icon) && !disabled && !flat && !text;
    	let Classes = i => i;
    	let iClasses = i => i;
    	let shade = 0;
    	const { bg, border, txt } = utils(color);
    	const cb = new ClassBuilder(classes, classesDefault$1);
    	let iconCb;

    	if (icon) {
    		iconCb = new ClassBuilder(iconClass);
    	}

    	const ripple = r(text || fab || outlined ? color : "white");

    	const props = filterProps(
    		[
    			'outlined',
    			'text',
    			'color',
    			'block',
    			'disabled',
    			'icon',
    			'small',
    			'light',
    			'dark',
    			'flat',
    			'add',
    			'remove',
    			'replace'
    		],
    		$$props
    	);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function _handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function _handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_2 = () => $$invalidate(0, value = !value);
    	const click_handler_3 = () => $$invalidate(0, value = !value);

    	$$self.$$set = $$new_props => {
    		$$invalidate(51, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('outlined' in $$new_props) $$invalidate(11, outlined = $$new_props.outlined);
    		if ('text' in $$new_props) $$invalidate(12, text = $$new_props.text);
    		if ('block' in $$new_props) $$invalidate(13, block = $$new_props.block);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ('small' in $$new_props) $$invalidate(4, small = $$new_props.small);
    		if ('light' in $$new_props) $$invalidate(14, light = $$new_props.light);
    		if ('dark' in $$new_props) $$invalidate(15, dark = $$new_props.dark);
    		if ('flat' in $$new_props) $$invalidate(16, flat = $$new_props.flat);
    		if ('iconClass' in $$new_props) $$invalidate(17, iconClass = $$new_props.iconClass);
    		if ('color' in $$new_props) $$invalidate(18, color = $$new_props.color);
    		if ('href' in $$new_props) $$invalidate(5, href = $$new_props.href);
    		if ('fab' in $$new_props) $$invalidate(10, fab = $$new_props.fab);
    		if ('type' in $$new_props) $$invalidate(6, type = $$new_props.type);
    		if ('remove' in $$new_props) $$invalidate(19, remove = $$new_props.remove);
    		if ('add' in $$new_props) $$invalidate(20, add = $$new_props.add);
    		if ('replace' in $$new_props) $$invalidate(21, replace = $$new_props.replace);
    		if ('classes' in $$new_props) $$invalidate(1, classes = $$new_props.classes);
    		if ('basicClasses' in $$new_props) $$invalidate(22, basicClasses = $$new_props.basicClasses);
    		if ('outlinedClasses' in $$new_props) $$invalidate(23, outlinedClasses = $$new_props.outlinedClasses);
    		if ('textClasses' in $$new_props) $$invalidate(24, textClasses = $$new_props.textClasses);
    		if ('iconClasses' in $$new_props) $$invalidate(25, iconClasses = $$new_props.iconClasses);
    		if ('fabClasses' in $$new_props) $$invalidate(26, fabClasses = $$new_props.fabClasses);
    		if ('smallClasses' in $$new_props) $$invalidate(27, smallClasses = $$new_props.smallClasses);
    		if ('disabledClasses' in $$new_props) $$invalidate(28, disabledClasses = $$new_props.disabledClasses);
    		if ('elevationClasses' in $$new_props) $$invalidate(29, elevationClasses = $$new_props.elevationClasses);
    		if ('$$scope' in $$new_props) $$invalidate(43, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		utils,
    		ClassBuilder,
    		filterProps,
    		createRipple: r,
    		value,
    		outlined,
    		text,
    		block,
    		disabled,
    		icon,
    		small,
    		light,
    		dark,
    		flat,
    		iconClass,
    		color,
    		href,
    		fab,
    		type,
    		remove,
    		add,
    		replace,
    		classesDefault: classesDefault$1,
    		basicDefault,
    		outlinedDefault,
    		textDefault,
    		iconDefault,
    		fabDefault,
    		smallDefault,
    		disabledDefault,
    		elevationDefault,
    		classes,
    		basicClasses,
    		outlinedClasses,
    		textClasses,
    		iconClasses,
    		fabClasses,
    		smallClasses,
    		disabledClasses,
    		elevationClasses,
    		basic,
    		elevation,
    		Classes,
    		iClasses,
    		shade,
    		bg,
    		border,
    		txt,
    		cb,
    		iconCb,
    		ripple,
    		props,
    		lighter,
    		normal
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(51, $$props = assign(assign({}, $$props), $$new_props));
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('outlined' in $$props) $$invalidate(11, outlined = $$new_props.outlined);
    		if ('text' in $$props) $$invalidate(12, text = $$new_props.text);
    		if ('block' in $$props) $$invalidate(13, block = $$new_props.block);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ('small' in $$props) $$invalidate(4, small = $$new_props.small);
    		if ('light' in $$props) $$invalidate(14, light = $$new_props.light);
    		if ('dark' in $$props) $$invalidate(15, dark = $$new_props.dark);
    		if ('flat' in $$props) $$invalidate(16, flat = $$new_props.flat);
    		if ('iconClass' in $$props) $$invalidate(17, iconClass = $$new_props.iconClass);
    		if ('color' in $$props) $$invalidate(18, color = $$new_props.color);
    		if ('href' in $$props) $$invalidate(5, href = $$new_props.href);
    		if ('fab' in $$props) $$invalidate(10, fab = $$new_props.fab);
    		if ('type' in $$props) $$invalidate(6, type = $$new_props.type);
    		if ('remove' in $$props) $$invalidate(19, remove = $$new_props.remove);
    		if ('add' in $$props) $$invalidate(20, add = $$new_props.add);
    		if ('replace' in $$props) $$invalidate(21, replace = $$new_props.replace);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('basicClasses' in $$props) $$invalidate(22, basicClasses = $$new_props.basicClasses);
    		if ('outlinedClasses' in $$props) $$invalidate(23, outlinedClasses = $$new_props.outlinedClasses);
    		if ('textClasses' in $$props) $$invalidate(24, textClasses = $$new_props.textClasses);
    		if ('iconClasses' in $$props) $$invalidate(25, iconClasses = $$new_props.iconClasses);
    		if ('fabClasses' in $$props) $$invalidate(26, fabClasses = $$new_props.fabClasses);
    		if ('smallClasses' in $$props) $$invalidate(27, smallClasses = $$new_props.smallClasses);
    		if ('disabledClasses' in $$props) $$invalidate(28, disabledClasses = $$new_props.disabledClasses);
    		if ('elevationClasses' in $$props) $$invalidate(29, elevationClasses = $$new_props.elevationClasses);
    		if ('Classes' in $$props) Classes = $$new_props.Classes;
    		if ('iClasses' in $$props) $$invalidate(7, iClasses = $$new_props.iClasses);
    		if ('shade' in $$props) $$invalidate(30, shade = $$new_props.shade);
    		if ('iconCb' in $$props) $$invalidate(31, iconCb = $$new_props.iconCb);
    		if ('lighter' in $$props) $$invalidate(32, lighter = $$new_props.lighter);
    		if ('normal' in $$props) $$invalidate(33, normal = $$new_props.normal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*light, dark, shade*/ 1073790976) {
    			{
    				$$invalidate(30, shade = light ? 200 : 0);
    				$$invalidate(30, shade = dark ? -400 : shade);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*shade*/ 1073741824) {
    			$$invalidate(33, normal = 500 - shade);
    		}

    		if ($$self.$$.dirty[0] & /*shade*/ 1073741824) {
    			$$invalidate(32, lighter = 400 - shade);
    		}

    		$$invalidate(1, classes = cb.flush().add(basicClasses, basic, basicDefault).add(`${bg(normal)} hover:${bg(lighter)}`, basic).add(elevationClasses, elevation, elevationDefault).add(outlinedClasses, outlined, outlinedDefault).add(`${border(lighter)} ${txt(normal)} hover:${bg("trans")} dark-hover:${bg("transDark")}`, outlined).add(`${txt(lighter)}`, text).add(textClasses, text, textDefault).add(iconClasses, icon, iconDefault).remove("py-2", icon).remove(txt(lighter), fab).add(disabledClasses, disabled, disabledDefault).add(smallClasses, small, smallDefault).add("flex items-center justify-center h-8 w-8", small && icon).add("border-solid", outlined).add("rounded-full", icon).add("w-full", block).add("rounded", basic || outlined || text).add("button", !icon).add(fabClasses, fab, fabDefault).add(`hover:${bg("transLight")}`, fab).add($$props.class).remove(remove).replace(replace).add(add).get());

    		if ($$self.$$.dirty[0] & /*fab, iconClass*/ 132096 | $$self.$$.dirty[1] & /*iconCb*/ 1) {
    			if (iconCb) {
    				$$invalidate(7, iClasses = iconCb.flush().add(txt(), fab && !iconClass).get());
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		value,
    		classes,
    		disabled,
    		icon,
    		small,
    		href,
    		type,
    		iClasses,
    		ripple,
    		props,
    		fab,
    		outlined,
    		text,
    		block,
    		light,
    		dark,
    		flat,
    		iconClass,
    		color,
    		remove,
    		add,
    		replace,
    		basicClasses,
    		outlinedClasses,
    		textClasses,
    		iconClasses,
    		fabClasses,
    		smallClasses,
    		disabledClasses,
    		elevationClasses,
    		shade,
    		iconCb,
    		lighter,
    		normal,
    		slots,
    		click_handler,
    		mouseover_handler,
    		_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		_handler_1,
    		click_handler_2,
    		click_handler_3,
    		$$scope
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$e,
    			create_fragment$e,
    			safe_not_equal,
    			{
    				value: 0,
    				outlined: 11,
    				text: 12,
    				block: 13,
    				disabled: 2,
    				icon: 3,
    				small: 4,
    				light: 14,
    				dark: 15,
    				flat: 16,
    				iconClass: 17,
    				color: 18,
    				href: 5,
    				fab: 10,
    				type: 6,
    				remove: 19,
    				add: 20,
    				replace: 21,
    				classes: 1,
    				basicClasses: 22,
    				outlinedClasses: 23,
    				textClasses: 24,
    				iconClasses: 25,
    				fabClasses: 26,
    				smallClasses: 27,
    				disabledClasses: 28,
    				elevationClasses: 29
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClass() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClass(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get basicClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basicClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlinedClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlinedClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fabClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fabClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get smallClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set smallClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabledClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabledClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get elevationClasses() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elevationClasses(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quadOut(t) {
        return -t * (t - 2.0);
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* node_modules/smelte/src/components/TextField/Label.svelte generated by Svelte v3.44.3 */
    const file$c = "node_modules/smelte/src/components/TextField/Label.svelte";

    function create_fragment$d(ctx) {
    	let label;
    	let label_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let label_levels = [
    		{
    			class: label_class_value = "" + (/*lClasses*/ ctx[0] + " " + /*$$props*/ ctx[2].class)
    		},
    		/*props*/ ctx[1]
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			toggle_class(label, "svelte-r33x2y", true);
    			add_location(label, file$c, 72, 0, 1606);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				(!current || dirty & /*lClasses, $$props*/ 5 && label_class_value !== (label_class_value = "" + (/*lClasses*/ ctx[0] + " " + /*$$props*/ ctx[2].class))) && { class: label_class_value },
    				/*props*/ ctx[1]
    			]));

    			toggle_class(label, "svelte-r33x2y", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Label', slots, ['default']);
    	let { focused = false } = $$props;
    	let { error = false } = $$props;
    	let { outlined = false } = $$props;
    	let { labelOnTop = false } = $$props;
    	let { prepend = false } = $$props;
    	let { color = "primary" } = $$props;
    	let { bgColor = "white" } = $$props;
    	let { dense = false } = $$props;
    	let labelDefault = `pt-4 absolute top-0 label-transition block pb-2 px-4 pointer-events-none cursor-text`;
    	let { add = "" } = $$props;
    	let { remove = "" } = $$props;
    	let { replace = "" } = $$props;
    	let { labelClasses = labelDefault } = $$props;
    	const { border, txt } = utils(color);
    	const l = new ClassBuilder(labelClasses, labelDefault);
    	let lClasses = i => i;
    	const props = filterProps(['focused', 'error', 'outlined', 'labelOnTop', 'prepend', 'color', 'dense'], $$props);

    	$$self.$$set = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('focused' in $$new_props) $$invalidate(3, focused = $$new_props.focused);
    		if ('error' in $$new_props) $$invalidate(4, error = $$new_props.error);
    		if ('outlined' in $$new_props) $$invalidate(5, outlined = $$new_props.outlined);
    		if ('labelOnTop' in $$new_props) $$invalidate(6, labelOnTop = $$new_props.labelOnTop);
    		if ('prepend' in $$new_props) $$invalidate(7, prepend = $$new_props.prepend);
    		if ('color' in $$new_props) $$invalidate(8, color = $$new_props.color);
    		if ('bgColor' in $$new_props) $$invalidate(9, bgColor = $$new_props.bgColor);
    		if ('dense' in $$new_props) $$invalidate(10, dense = $$new_props.dense);
    		if ('add' in $$new_props) $$invalidate(11, add = $$new_props.add);
    		if ('remove' in $$new_props) $$invalidate(12, remove = $$new_props.remove);
    		if ('replace' in $$new_props) $$invalidate(13, replace = $$new_props.replace);
    		if ('labelClasses' in $$new_props) $$invalidate(14, labelClasses = $$new_props.labelClasses);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		utils,
    		ClassBuilder,
    		filterProps,
    		focused,
    		error,
    		outlined,
    		labelOnTop,
    		prepend,
    		color,
    		bgColor,
    		dense,
    		labelDefault,
    		add,
    		remove,
    		replace,
    		labelClasses,
    		border,
    		txt,
    		l,
    		lClasses,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
    		if ('focused' in $$props) $$invalidate(3, focused = $$new_props.focused);
    		if ('error' in $$props) $$invalidate(4, error = $$new_props.error);
    		if ('outlined' in $$props) $$invalidate(5, outlined = $$new_props.outlined);
    		if ('labelOnTop' in $$props) $$invalidate(6, labelOnTop = $$new_props.labelOnTop);
    		if ('prepend' in $$props) $$invalidate(7, prepend = $$new_props.prepend);
    		if ('color' in $$props) $$invalidate(8, color = $$new_props.color);
    		if ('bgColor' in $$props) $$invalidate(9, bgColor = $$new_props.bgColor);
    		if ('dense' in $$props) $$invalidate(10, dense = $$new_props.dense);
    		if ('labelDefault' in $$props) labelDefault = $$new_props.labelDefault;
    		if ('add' in $$props) $$invalidate(11, add = $$new_props.add);
    		if ('remove' in $$props) $$invalidate(12, remove = $$new_props.remove);
    		if ('replace' in $$props) $$invalidate(13, replace = $$new_props.replace);
    		if ('labelClasses' in $$props) $$invalidate(14, labelClasses = $$new_props.labelClasses);
    		if ('lClasses' in $$props) $$invalidate(0, lClasses = $$new_props.lClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*focused, error, labelOnTop, outlined, bgColor, prepend, dense, add, remove, replace*/ 16120) {
    			$$invalidate(0, lClasses = l.flush().add(txt(), focused && !error).add('text-error-500', focused && error).add('label-top text-xs', labelOnTop).add('text-xs', focused).remove('pt-4 pb-2 px-4 px-1 pt-0', labelOnTop && outlined).add(`ml-3 p-1 pt-0 mt-0 bg-${bgColor} dark:bg-dark-500`, labelOnTop && outlined).remove('px-4', prepend).add('pr-4 pl-10', prepend).remove('pt-4', dense).add('pt-3', dense).add(add).remove(remove).replace(replace).get());
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		lClasses,
    		props,
    		$$props,
    		focused,
    		error,
    		outlined,
    		labelOnTop,
    		prepend,
    		color,
    		bgColor,
    		dense,
    		add,
    		remove,
    		replace,
    		labelClasses,
    		$$scope,
    		slots
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			focused: 3,
    			error: 4,
    			outlined: 5,
    			labelOnTop: 6,
    			prepend: 7,
    			color: 8,
    			bgColor: 9,
    			dense: 10,
    			add: 11,
    			remove: 12,
    			replace: 13,
    			labelClasses: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get focused() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focused(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelOnTop() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelOnTop(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prepend() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prepend(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgColor() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelClasses() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelClasses(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/TextField/Hint.svelte generated by Svelte v3.44.3 */
    const file$b = "node_modules/smelte/src/components/TextField/Hint.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = (/*hint*/ ctx[1] || '') + "";
    	let t0;
    	let t1_value = (/*error*/ ctx[0] || '') + "";
    	let t1;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			html_tag = new HtmlTag();
    			t0 = space();
    			t1 = text(t1_value);
    			html_tag.a = t0;
    			attr_dev(div, "class", /*classes*/ ctx[3]);
    			add_location(div, file$b, 35, 0, 787);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*hint*/ 2) && raw_value !== (raw_value = (/*hint*/ ctx[1] || '') + "")) html_tag.p(raw_value);
    			if ((!current || dirty & /*error*/ 1) && t1_value !== (t1_value = (/*error*/ ctx[0] || '') + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*classes*/ 8) {
    				attr_dev(div, "class", /*classes*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, /*transitionProps*/ ctx[2], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, /*transitionProps*/ ctx[2], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hint', slots, []);
    	let classesDefault = "text-xs py-1 pl-4 absolute left-0";
    	let { error = false } = $$props;
    	let { hint = "" } = $$props;
    	let { add = "" } = $$props;
    	let { remove = "" } = $$props;
    	let { replace = "" } = $$props;
    	let { transitionProps = { y: -10, duration: 100, easing: quadOut } } = $$props;
    	const l = new ClassBuilder($$props.class, classesDefault);
    	let Classes = i => i;
    	const props = filterProps(['error', 'hint'], $$props);

    	$$self.$$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('error' in $$new_props) $$invalidate(0, error = $$new_props.error);
    		if ('hint' in $$new_props) $$invalidate(1, hint = $$new_props.hint);
    		if ('add' in $$new_props) $$invalidate(4, add = $$new_props.add);
    		if ('remove' in $$new_props) $$invalidate(5, remove = $$new_props.remove);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('transitionProps' in $$new_props) $$invalidate(2, transitionProps = $$new_props.transitionProps);
    	};

    	$$self.$capture_state = () => ({
    		utils,
    		ClassBuilder,
    		filterProps,
    		fly,
    		quadOut,
    		classesDefault,
    		error,
    		hint,
    		add,
    		remove,
    		replace,
    		transitionProps,
    		l,
    		Classes,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    		if ('classesDefault' in $$props) classesDefault = $$new_props.classesDefault;
    		if ('error' in $$props) $$invalidate(0, error = $$new_props.error);
    		if ('hint' in $$props) $$invalidate(1, hint = $$new_props.hint);
    		if ('add' in $$props) $$invalidate(4, add = $$new_props.add);
    		if ('remove' in $$props) $$invalidate(5, remove = $$new_props.remove);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('transitionProps' in $$props) $$invalidate(2, transitionProps = $$new_props.transitionProps);
    		if ('Classes' in $$props) Classes = $$new_props.Classes;
    		if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*error, hint, add, remove, replace*/ 115) {
    			$$invalidate(3, classes = l.flush().add('text-error-500', error).add('text-gray-600', hint).add(add).remove(remove).replace(replace).get());
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [error, hint, transitionProps, classes, add, remove, replace];
    }

    class Hint extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			error: 0,
    			hint: 1,
    			add: 4,
    			remove: 5,
    			replace: 6,
    			transitionProps: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hint",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get error() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hint() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hint(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionProps() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionProps(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/TextField/Underline.svelte generated by Svelte v3.44.3 */
    const file$a = "node_modules/smelte/src/components/TextField/Underline.svelte";

    function create_fragment$b(ctx) {
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*classes*/ ctx[2]) + " svelte-xd9zs6"));
    			set_style(div0, "height", "2px");
    			set_style(div0, "transition", "width .2s ease");
    			add_location(div0, file$a, 61, 2, 1133);
    			attr_dev(div1, "class", div1_class_value = "line absolute bottom-0 left-0 w-full bg-gray-600 " + /*$$props*/ ctx[3].class + " svelte-xd9zs6");
    			toggle_class(div1, "hidden", /*noUnderline*/ ctx[0] || /*outlined*/ ctx[1]);
    			add_location(div1, file$a, 58, 0, 1009);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classes*/ 4 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*classes*/ ctx[2]) + " svelte-xd9zs6"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*$$props*/ 8 && div1_class_value !== (div1_class_value = "line absolute bottom-0 left-0 w-full bg-gray-600 " + /*$$props*/ ctx[3].class + " svelte-xd9zs6")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*$$props, noUnderline, outlined*/ 11) {
    				toggle_class(div1, "hidden", /*noUnderline*/ ctx[0] || /*outlined*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let classes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Underline', slots, []);
    	let { noUnderline = false } = $$props;
    	let { outlined = false } = $$props;
    	let { focused = false } = $$props;
    	let { error = false } = $$props;
    	let { color = "primary" } = $$props;
    	let defaultClasses = `mx-auto w-0`;
    	let { add = "" } = $$props;
    	let { remove = "" } = $$props;
    	let { replace = "" } = $$props;
    	let { lineClasses = defaultClasses } = $$props;
    	const { bg, border, txt, caret } = utils(color);
    	const l = new ClassBuilder(lineClasses, defaultClasses);
    	let Classes = i => i;
    	const props = filterProps(['focused', 'error', 'outlined', 'labelOnTop', 'prepend', 'bgcolor', 'color'], $$props);

    	$$self.$$set = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('noUnderline' in $$new_props) $$invalidate(0, noUnderline = $$new_props.noUnderline);
    		if ('outlined' in $$new_props) $$invalidate(1, outlined = $$new_props.outlined);
    		if ('focused' in $$new_props) $$invalidate(4, focused = $$new_props.focused);
    		if ('error' in $$new_props) $$invalidate(5, error = $$new_props.error);
    		if ('color' in $$new_props) $$invalidate(6, color = $$new_props.color);
    		if ('add' in $$new_props) $$invalidate(7, add = $$new_props.add);
    		if ('remove' in $$new_props) $$invalidate(8, remove = $$new_props.remove);
    		if ('replace' in $$new_props) $$invalidate(9, replace = $$new_props.replace);
    		if ('lineClasses' in $$new_props) $$invalidate(10, lineClasses = $$new_props.lineClasses);
    	};

    	$$self.$capture_state = () => ({
    		utils,
    		ClassBuilder,
    		filterProps,
    		noUnderline,
    		outlined,
    		focused,
    		error,
    		color,
    		defaultClasses,
    		add,
    		remove,
    		replace,
    		lineClasses,
    		bg,
    		border,
    		txt,
    		caret,
    		l,
    		Classes,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
    		if ('noUnderline' in $$props) $$invalidate(0, noUnderline = $$new_props.noUnderline);
    		if ('outlined' in $$props) $$invalidate(1, outlined = $$new_props.outlined);
    		if ('focused' in $$props) $$invalidate(4, focused = $$new_props.focused);
    		if ('error' in $$props) $$invalidate(5, error = $$new_props.error);
    		if ('color' in $$props) $$invalidate(6, color = $$new_props.color);
    		if ('defaultClasses' in $$props) defaultClasses = $$new_props.defaultClasses;
    		if ('add' in $$props) $$invalidate(7, add = $$new_props.add);
    		if ('remove' in $$props) $$invalidate(8, remove = $$new_props.remove);
    		if ('replace' in $$props) $$invalidate(9, replace = $$new_props.replace);
    		if ('lineClasses' in $$props) $$invalidate(10, lineClasses = $$new_props.lineClasses);
    		if ('Classes' in $$props) Classes = $$new_props.Classes;
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*focused, error, add, remove, replace*/ 944) {
    			$$invalidate(2, classes = l.flush().add(txt(), focused && !error).add('bg-error-500', error).add('w-full', focused || error).add(bg(), focused).add(add).remove(remove).replace(replace).get());
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		noUnderline,
    		outlined,
    		classes,
    		$$props,
    		focused,
    		error,
    		color,
    		add,
    		remove,
    		replace,
    		lineClasses
    	];
    }

    class Underline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			noUnderline: 0,
    			outlined: 1,
    			focused: 4,
    			error: 5,
    			color: 6,
    			add: 7,
    			remove: 8,
    			replace: 9,
    			lineClasses: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Underline",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get noUnderline() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noUnderline(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focused() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focused(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineClasses() {
    		throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineClasses(value) {
    		throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/smelte/src/components/TextField/TextField.svelte generated by Svelte v3.44.3 */
    const file$9 = "node_modules/smelte/src/components/TextField/TextField.svelte";
    const get_prepend_slot_changes = dirty => ({});
    const get_prepend_slot_context = ctx => ({});
    const get_append_slot_changes = dirty => ({});
    const get_append_slot_context = ctx => ({});
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (139:2) {#if label}
    function create_if_block_6$1(ctx) {
    	let current;
    	const label_slot_template = /*#slots*/ ctx[40].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[69], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 128)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[69],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[69])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[69], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*labelOnTop, focused, error, outlined, prepend, color, bgColor, dense, label*/ 33952078)) {
    					label_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(139:2) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (141:4) <Label       {labelOnTop}       {focused}       {error}       {outlined}       {prepend}       {color}       {bgColor}       dense={dense && !outlined}     >
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*label*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*label*/ 8) set_data_dev(t, /*label*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(141:4) <Label       {labelOnTop}       {focused}       {error}       {outlined}       {prepend}       {color}       {bgColor}       dense={dense && !outlined}     >",
    		ctx
    	});

    	return block;
    }

    // (140:21)      
    function fallback_block_2(ctx) {
    	let label_1;
    	let current;

    	label_1 = new Label({
    			props: {
    				labelOnTop: /*labelOnTop*/ ctx[25],
    				focused: /*focused*/ ctx[1],
    				error: /*error*/ ctx[6],
    				outlined: /*outlined*/ ctx[2],
    				prepend: /*prepend*/ ctx[8],
    				color: /*color*/ ctx[17],
    				bgColor: /*bgColor*/ ctx[18],
    				dense: /*dense*/ ctx[12] && !/*outlined*/ ctx[2],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_1_changes = {};
    			if (dirty[0] & /*labelOnTop*/ 33554432) label_1_changes.labelOnTop = /*labelOnTop*/ ctx[25];
    			if (dirty[0] & /*focused*/ 2) label_1_changes.focused = /*focused*/ ctx[1];
    			if (dirty[0] & /*error*/ 64) label_1_changes.error = /*error*/ ctx[6];
    			if (dirty[0] & /*outlined*/ 4) label_1_changes.outlined = /*outlined*/ ctx[2];
    			if (dirty[0] & /*prepend*/ 256) label_1_changes.prepend = /*prepend*/ ctx[8];
    			if (dirty[0] & /*color*/ 131072) label_1_changes.color = /*color*/ ctx[17];
    			if (dirty[0] & /*bgColor*/ 262144) label_1_changes.bgColor = /*bgColor*/ ctx[18];
    			if (dirty[0] & /*dense, outlined*/ 4100) label_1_changes.dense = /*dense*/ ctx[12] && !/*outlined*/ ctx[2];

    			if (dirty[0] & /*label*/ 8 | dirty[2] & /*$$scope*/ 128) {
    				label_1_changes.$$scope = { dirty, ctx };
    			}

    			label_1.$set(label_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(140:21)      ",
    		ctx
    	});

    	return block;
    }

    // (191:36) 
    function create_if_block_5$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			input.readOnly = true;
    			attr_dev(input, "class", /*iClasses*/ ctx[24]);
    			input.disabled = /*disabled*/ ctx[20];
    			input.value = /*value*/ ctx[0];
    			add_location(input, file$9, 191, 4, 4933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler_2*/ ctx[57], false, false, false),
    					listen_dev(input, "input", /*input_handler_2*/ ctx[58], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[59], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[60], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[61], false, false, false),
    					listen_dev(input, "click", /*click_handler_2*/ ctx[62], false, false, false),
    					listen_dev(input, "blur", /*blur_handler_2*/ ctx[63], false, false, false),
    					listen_dev(input, "focus", /*focus_handler_2*/ ctx[64], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iClasses*/ 16777216) {
    				attr_dev(input, "class", /*iClasses*/ ctx[24]);
    			}

    			if (dirty[0] & /*disabled*/ 1048576) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[20]);
    			}

    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(191:36) ",
    		ctx
    	});

    	return block;
    }

    // (172:32) 
    function create_if_block_4$1(ctx) {
    	let textarea_1;
    	let textarea_1_placeholder_value;
    	let mounted;
    	let dispose;

    	let textarea_1_levels = [
    		{ rows: /*rows*/ ctx[10] },
    		{ "aria-label": /*label*/ ctx[3] },
    		{ class: /*iClasses*/ ctx[24] },
    		{ disabled: /*disabled*/ ctx[20] },
    		/*props*/ ctx[29],
    		{
    			placeholder: textarea_1_placeholder_value = !/*value*/ ctx[0] ? /*placeholder*/ ctx[4] : ""
    		}
    	];

    	let textarea_1_data = {};

    	for (let i = 0; i < textarea_1_levels.length; i += 1) {
    		textarea_1_data = assign(textarea_1_data, textarea_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea_1 = element("textarea");
    			set_attributes(textarea_1, textarea_1_data);
    			add_location(textarea_1, file$9, 172, 4, 4535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea_1, anchor);
    			if (textarea_1.autofocus) textarea_1.focus();
    			set_input_value(textarea_1, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea_1, "change", /*change_handler_1*/ ctx[49], false, false, false),
    					listen_dev(textarea_1, "input", /*input_handler_1*/ ctx[50], false, false, false),
    					listen_dev(textarea_1, "keydown", /*keydown_handler_1*/ ctx[51], false, false, false),
    					listen_dev(textarea_1, "keypress", /*keypress_handler_1*/ ctx[52], false, false, false),
    					listen_dev(textarea_1, "keyup", /*keyup_handler_1*/ ctx[53], false, false, false),
    					listen_dev(textarea_1, "click", /*click_handler_1*/ ctx[54], false, false, false),
    					listen_dev(textarea_1, "focus", /*focus_handler_1*/ ctx[55], false, false, false),
    					listen_dev(textarea_1, "blur", /*blur_handler_1*/ ctx[56], false, false, false),
    					listen_dev(textarea_1, "input", /*textarea_1_input_handler*/ ctx[66]),
    					listen_dev(textarea_1, "focus", /*toggleFocused*/ ctx[28], false, false, false),
    					listen_dev(textarea_1, "blur", /*toggleFocused*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea_1, textarea_1_data = get_spread_update(textarea_1_levels, [
    				dirty[0] & /*rows*/ 1024 && { rows: /*rows*/ ctx[10] },
    				dirty[0] & /*label*/ 8 && { "aria-label": /*label*/ ctx[3] },
    				dirty[0] & /*iClasses*/ 16777216 && { class: /*iClasses*/ ctx[24] },
    				dirty[0] & /*disabled*/ 1048576 && { disabled: /*disabled*/ ctx[20] },
    				/*props*/ ctx[29],
    				dirty[0] & /*value, placeholder*/ 17 && textarea_1_placeholder_value !== (textarea_1_placeholder_value = !/*value*/ ctx[0] ? /*placeholder*/ ctx[4] : "") && {
    					placeholder: textarea_1_placeholder_value
    				}
    			]));

    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(textarea_1, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(172:32) ",
    		ctx
    	});

    	return block;
    }

    // (154:2) {#if (!textarea && !select) || autocomplete}
    function create_if_block_3$1(ctx) {
    	let input;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ "aria-label": /*label*/ ctx[3] },
    		{ class: /*iClasses*/ ctx[24] },
    		{ disabled: /*disabled*/ ctx[20] },
    		/*props*/ ctx[29],
    		{
    			placeholder: input_placeholder_value = !/*value*/ ctx[0] ? /*placeholder*/ ctx[4] : ""
    		}
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$9, 154, 4, 4157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "focus", /*toggleFocused*/ ctx[28], false, false, false),
    					listen_dev(input, "blur", /*toggleFocused*/ ctx[28], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[41], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[65]),
    					listen_dev(input, "change", /*change_handler*/ ctx[42], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[43], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[44], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[45], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[46], false, false, false),
    					listen_dev(input, "click", /*click_handler*/ ctx[47], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[48], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*label*/ 8 && { "aria-label": /*label*/ ctx[3] },
    				dirty[0] & /*iClasses*/ 16777216 && { class: /*iClasses*/ ctx[24] },
    				dirty[0] & /*disabled*/ 1048576 && { disabled: /*disabled*/ ctx[20] },
    				/*props*/ ctx[29],
    				dirty[0] & /*value, placeholder*/ 17 && input_placeholder_value !== (input_placeholder_value = !/*value*/ ctx[0] ? /*placeholder*/ ctx[4] : "") && { placeholder: input_placeholder_value }
    			]));

    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(154:2) {#if (!textarea && !select) || autocomplete}",
    		ctx
    	});

    	return block;
    }

    // (207:2) {#if append}
    function create_if_block_2$1(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const append_slot_template = /*#slots*/ ctx[40].append;
    	const append_slot = create_slot(append_slot_template, ctx, /*$$scope*/ ctx[69], get_append_slot_context);
    	const append_slot_or_fallback = append_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (append_slot_or_fallback) append_slot_or_fallback.c();
    			attr_dev(div, "class", /*aClasses*/ ctx[22]);
    			add_location(div, file$9, 207, 4, 5167);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (append_slot_or_fallback) {
    				append_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_3*/ ctx[67], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (append_slot) {
    				if (append_slot.p && (!current || dirty[2] & /*$$scope*/ 128)) {
    					update_slot_base(
    						append_slot,
    						append_slot_template,
    						ctx,
    						/*$$scope*/ ctx[69],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[69])
    						: get_slot_changes(append_slot_template, /*$$scope*/ ctx[69], dirty, get_append_slot_changes),
    						get_append_slot_context
    					);
    				}
    			} else {
    				if (append_slot_or_fallback && append_slot_or_fallback.p && (!current || dirty[0] & /*appendReverse, focused, iconClass, append*/ 557186)) {
    					append_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*aClasses*/ 4194304) {
    				attr_dev(div, "class", /*aClasses*/ ctx[22]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(append_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(append_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (append_slot_or_fallback) append_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(207:2) {#if append}",
    		ctx
    	});

    	return block;
    }

    // (213:8) <Icon           reverse={appendReverse}           class="{focused ? txt() : ""} {iconClass}"         >
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*append*/ ctx[7]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*append*/ 128) set_data_dev(t, /*append*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(213:8) <Icon           reverse={appendReverse}           class=\\\"{focused ? txt() : \\\"\\\"} {iconClass}\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (212:26)          
    function fallback_block_1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				reverse: /*appendReverse*/ ctx[15],
    				class: "" + ((/*focused*/ ctx[1] ? /*txt*/ ctx[27]() : "") + " " + /*iconClass*/ ctx[19]),
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty[0] & /*appendReverse*/ 32768) icon_changes.reverse = /*appendReverse*/ ctx[15];
    			if (dirty[0] & /*focused, iconClass*/ 524290) icon_changes.class = "" + ((/*focused*/ ctx[1] ? /*txt*/ ctx[27]() : "") + " " + /*iconClass*/ ctx[19]);

    			if (dirty[0] & /*append*/ 128 | dirty[2] & /*$$scope*/ 128) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(212:26)          ",
    		ctx
    	});

    	return block;
    }

    // (223:2) {#if prepend}
    function create_if_block_1$2(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const prepend_slot_template = /*#slots*/ ctx[40].prepend;
    	const prepend_slot = create_slot(prepend_slot_template, ctx, /*$$scope*/ ctx[69], get_prepend_slot_context);
    	const prepend_slot_or_fallback = prepend_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (prepend_slot_or_fallback) prepend_slot_or_fallback.c();
    			attr_dev(div, "class", /*pClasses*/ ctx[23]);
    			add_location(div, file$9, 223, 4, 5476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (prepend_slot_or_fallback) {
    				prepend_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_4*/ ctx[68], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (prepend_slot) {
    				if (prepend_slot.p && (!current || dirty[2] & /*$$scope*/ 128)) {
    					update_slot_base(
    						prepend_slot,
    						prepend_slot_template,
    						ctx,
    						/*$$scope*/ ctx[69],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[69])
    						: get_slot_changes(prepend_slot_template, /*$$scope*/ ctx[69], dirty, get_prepend_slot_changes),
    						get_prepend_slot_context
    					);
    				}
    			} else {
    				if (prepend_slot_or_fallback && prepend_slot_or_fallback.p && (!current || dirty[0] & /*prependReverse, focused, iconClass, prepend*/ 590082)) {
    					prepend_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*pClasses*/ 8388608) {
    				attr_dev(div, "class", /*pClasses*/ ctx[23]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (prepend_slot_or_fallback) prepend_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(223:2) {#if prepend}",
    		ctx
    	});

    	return block;
    }

    // (229:8) <Icon           reverse={prependReverse}           class="{focused ? txt() : ""} {iconClass}"         >
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*prepend*/ ctx[8]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prepend*/ 256) set_data_dev(t, /*prepend*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(229:8) <Icon           reverse={prependReverse}           class=\\\"{focused ? txt() : \\\"\\\"} {iconClass}\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (228:27)          
    function fallback_block(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				reverse: /*prependReverse*/ ctx[16],
    				class: "" + ((/*focused*/ ctx[1] ? /*txt*/ ctx[27]() : "") + " " + /*iconClass*/ ctx[19]),
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty[0] & /*prependReverse*/ 65536) icon_changes.reverse = /*prependReverse*/ ctx[16];
    			if (dirty[0] & /*focused, iconClass*/ 524290) icon_changes.class = "" + ((/*focused*/ ctx[1] ? /*txt*/ ctx[27]() : "") + " " + /*iconClass*/ ctx[19]);

    			if (dirty[0] & /*prepend*/ 256 | dirty[2] & /*$$scope*/ 128) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(228:27)          ",
    		ctx
    	});

    	return block;
    }

    // (246:2) {#if showHint}
    function create_if_block$6(ctx) {
    	let hint_1;
    	let current;

    	hint_1 = new Hint({
    			props: {
    				error: /*error*/ ctx[6],
    				hint: /*hint*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(hint_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hint_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hint_1_changes = {};
    			if (dirty[0] & /*error*/ 64) hint_1_changes.error = /*error*/ ctx[6];
    			if (dirty[0] & /*hint*/ 32) hint_1_changes.hint = /*hint*/ ctx[5];
    			hint_1.$set(hint_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hint_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hint_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hint_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(246:2) {#if showHint}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let underline;
    	let t4;
    	let current;
    	let if_block0 = /*label*/ ctx[3] && create_if_block_6$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (!/*textarea*/ ctx[9] && !/*select*/ ctx[11] || /*autocomplete*/ ctx[13]) return create_if_block_3$1;
    		if (/*textarea*/ ctx[9] && !/*select*/ ctx[11]) return create_if_block_4$1;
    		if (/*select*/ ctx[11] && !/*autocomplete*/ ctx[13]) return create_if_block_5$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let if_block2 = /*append*/ ctx[7] && create_if_block_2$1(ctx);
    	let if_block3 = /*prepend*/ ctx[8] && create_if_block_1$2(ctx);

    	underline = new Underline({
    			props: {
    				noUnderline: /*noUnderline*/ ctx[14],
    				outlined: /*outlined*/ ctx[2],
    				focused: /*focused*/ ctx[1],
    				error: /*error*/ ctx[6],
    				color: /*color*/ ctx[17]
    			},
    			$$inline: true
    		});

    	let if_block4 = /*showHint*/ ctx[26] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			create_component(underline.$$.fragment);
    			t4 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(div, "class", /*wClasses*/ ctx[21]);
    			add_location(div, file$9, 137, 0, 3851);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t3);
    			mount_component(underline, div, null);
    			append_dev(div, t4);
    			if (if_block4) if_block4.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*label*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*label*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			}

    			if (/*append*/ ctx[7]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*append*/ 128) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*prepend*/ ctx[8]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*prepend*/ 256) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_1$2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			const underline_changes = {};
    			if (dirty[0] & /*noUnderline*/ 16384) underline_changes.noUnderline = /*noUnderline*/ ctx[14];
    			if (dirty[0] & /*outlined*/ 4) underline_changes.outlined = /*outlined*/ ctx[2];
    			if (dirty[0] & /*focused*/ 2) underline_changes.focused = /*focused*/ ctx[1];
    			if (dirty[0] & /*error*/ 64) underline_changes.error = /*error*/ ctx[6];
    			if (dirty[0] & /*color*/ 131072) underline_changes.color = /*color*/ ctx[17];
    			underline.$set(underline_changes);

    			if (/*showHint*/ ctx[26]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*showHint*/ 67108864) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block$6(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*wClasses*/ 2097152) {
    				attr_dev(div, "class", /*wClasses*/ ctx[21]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(underline.$$.fragment, local);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(underline.$$.fragment, local);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();

    			if (if_block1) {
    				if_block1.d();
    			}

    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			destroy_component(underline);
    			if (if_block4) if_block4.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const inputDefault = "pb-2 pt-6 px-4 rounded-t text-black dark:text-gray-100 w-full";
    const classesDefault = "mt-2 mb-6 relative text-gray-600 dark:text-gray-100";
    const appendDefault = "absolute right-0 top-0 pb-2 pr-4 pt-4 text-gray-700 z-10";
    const prependDefault = "absolute left-0 top-0 pb-2 pl-2 pt-4 text-xs text-gray-700 z-10";

    function instance$a($$self, $$props, $$invalidate) {
    	let showHint;
    	let labelOnTop;
    	let iClasses;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextField', slots, ['label','append','prepend']);
    	let { outlined = false } = $$props;
    	let { value = null } = $$props;
    	let { label = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { hint = "" } = $$props;
    	let { error = false } = $$props;
    	let { append = "" } = $$props;
    	let { prepend = "" } = $$props;
    	let { persistentHint = false } = $$props;
    	let { textarea = false } = $$props;
    	let { rows = 5 } = $$props;
    	let { select = false } = $$props;
    	let { dense = false } = $$props;
    	let { autocomplete = false } = $$props;
    	let { noUnderline = false } = $$props;
    	let { appendReverse = false } = $$props;
    	let { prependReverse = false } = $$props;
    	let { color = "primary" } = $$props;
    	let { bgColor = "white" } = $$props;
    	let { iconClass = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { add = "" } = $$props;
    	let { remove = "" } = $$props;
    	let { replace = "" } = $$props;
    	let { inputClasses = inputDefault } = $$props;
    	let { classes = classesDefault } = $$props;
    	let { appendClasses = appendDefault } = $$props;
    	let { prependClasses = prependDefault } = $$props;
    	const { bg, border, txt, caret } = utils(color);
    	const cb = new ClassBuilder(inputClasses, inputDefault);
    	const ccb = new ClassBuilder(classes, classesDefault);
    	const acb = new ClassBuilder(appendClasses, appendDefault);
    	const pcb = new ClassBuilder(prependClasses, prependDefault);

    	let { extend = () => {
    		
    	} } = $$props;

    	let { focused = false } = $$props;
    	let wClasses = i => i;
    	let aClasses = i => i;
    	let pClasses = i => i;

    	function toggleFocused() {
    		$$invalidate(1, focused = !focused);
    	}

    	const props = filterProps(
    		[
    			'outlined',
    			'label',
    			'placeholder',
    			'hint',
    			'error',
    			'append',
    			'prepend',
    			'persistentHint',
    			'textarea',
    			'rows',
    			'select',
    			'autocomplete',
    			'noUnderline',
    			'appendReverse',
    			'prependReverse',
    			'color',
    			'bgColor',
    			'disabled',
    			'replace',
    			'remove',
    			'small'
    		],
    		$$props
    	);

    	const dispatch = createEventDispatcher();

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function textarea_1_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const click_handler_3 = () => dispatch("click-append");
    	const click_handler_4 = () => dispatch("click-prepend");

    	$$self.$$set = $$new_props => {
    		$$invalidate(77, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('outlined' in $$new_props) $$invalidate(2, outlined = $$new_props.outlined);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('label' in $$new_props) $$invalidate(3, label = $$new_props.label);
    		if ('placeholder' in $$new_props) $$invalidate(4, placeholder = $$new_props.placeholder);
    		if ('hint' in $$new_props) $$invalidate(5, hint = $$new_props.hint);
    		if ('error' in $$new_props) $$invalidate(6, error = $$new_props.error);
    		if ('append' in $$new_props) $$invalidate(7, append = $$new_props.append);
    		if ('prepend' in $$new_props) $$invalidate(8, prepend = $$new_props.prepend);
    		if ('persistentHint' in $$new_props) $$invalidate(31, persistentHint = $$new_props.persistentHint);
    		if ('textarea' in $$new_props) $$invalidate(9, textarea = $$new_props.textarea);
    		if ('rows' in $$new_props) $$invalidate(10, rows = $$new_props.rows);
    		if ('select' in $$new_props) $$invalidate(11, select = $$new_props.select);
    		if ('dense' in $$new_props) $$invalidate(12, dense = $$new_props.dense);
    		if ('autocomplete' in $$new_props) $$invalidate(13, autocomplete = $$new_props.autocomplete);
    		if ('noUnderline' in $$new_props) $$invalidate(14, noUnderline = $$new_props.noUnderline);
    		if ('appendReverse' in $$new_props) $$invalidate(15, appendReverse = $$new_props.appendReverse);
    		if ('prependReverse' in $$new_props) $$invalidate(16, prependReverse = $$new_props.prependReverse);
    		if ('color' in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ('bgColor' in $$new_props) $$invalidate(18, bgColor = $$new_props.bgColor);
    		if ('iconClass' in $$new_props) $$invalidate(19, iconClass = $$new_props.iconClass);
    		if ('disabled' in $$new_props) $$invalidate(20, disabled = $$new_props.disabled);
    		if ('add' in $$new_props) $$invalidate(32, add = $$new_props.add);
    		if ('remove' in $$new_props) $$invalidate(33, remove = $$new_props.remove);
    		if ('replace' in $$new_props) $$invalidate(34, replace = $$new_props.replace);
    		if ('inputClasses' in $$new_props) $$invalidate(35, inputClasses = $$new_props.inputClasses);
    		if ('classes' in $$new_props) $$invalidate(36, classes = $$new_props.classes);
    		if ('appendClasses' in $$new_props) $$invalidate(37, appendClasses = $$new_props.appendClasses);
    		if ('prependClasses' in $$new_props) $$invalidate(38, prependClasses = $$new_props.prependClasses);
    		if ('extend' in $$new_props) $$invalidate(39, extend = $$new_props.extend);
    		if ('focused' in $$new_props) $$invalidate(1, focused = $$new_props.focused);
    		if ('$$scope' in $$new_props) $$invalidate(69, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		utils,
    		ClassBuilder,
    		filterProps,
    		Icon,
    		Label,
    		Hint,
    		Underline,
    		outlined,
    		value,
    		label,
    		placeholder,
    		hint,
    		error,
    		append,
    		prepend,
    		persistentHint,
    		textarea,
    		rows,
    		select,
    		dense,
    		autocomplete,
    		noUnderline,
    		appendReverse,
    		prependReverse,
    		color,
    		bgColor,
    		iconClass,
    		disabled,
    		inputDefault,
    		classesDefault,
    		appendDefault,
    		prependDefault,
    		add,
    		remove,
    		replace,
    		inputClasses,
    		classes,
    		appendClasses,
    		prependClasses,
    		bg,
    		border,
    		txt,
    		caret,
    		cb,
    		ccb,
    		acb,
    		pcb,
    		extend,
    		focused,
    		wClasses,
    		aClasses,
    		pClasses,
    		toggleFocused,
    		props,
    		dispatch,
    		iClasses,
    		labelOnTop,
    		showHint
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(77, $$props = assign(assign({}, $$props), $$new_props));
    		if ('outlined' in $$props) $$invalidate(2, outlined = $$new_props.outlined);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('label' in $$props) $$invalidate(3, label = $$new_props.label);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$new_props.placeholder);
    		if ('hint' in $$props) $$invalidate(5, hint = $$new_props.hint);
    		if ('error' in $$props) $$invalidate(6, error = $$new_props.error);
    		if ('append' in $$props) $$invalidate(7, append = $$new_props.append);
    		if ('prepend' in $$props) $$invalidate(8, prepend = $$new_props.prepend);
    		if ('persistentHint' in $$props) $$invalidate(31, persistentHint = $$new_props.persistentHint);
    		if ('textarea' in $$props) $$invalidate(9, textarea = $$new_props.textarea);
    		if ('rows' in $$props) $$invalidate(10, rows = $$new_props.rows);
    		if ('select' in $$props) $$invalidate(11, select = $$new_props.select);
    		if ('dense' in $$props) $$invalidate(12, dense = $$new_props.dense);
    		if ('autocomplete' in $$props) $$invalidate(13, autocomplete = $$new_props.autocomplete);
    		if ('noUnderline' in $$props) $$invalidate(14, noUnderline = $$new_props.noUnderline);
    		if ('appendReverse' in $$props) $$invalidate(15, appendReverse = $$new_props.appendReverse);
    		if ('prependReverse' in $$props) $$invalidate(16, prependReverse = $$new_props.prependReverse);
    		if ('color' in $$props) $$invalidate(17, color = $$new_props.color);
    		if ('bgColor' in $$props) $$invalidate(18, bgColor = $$new_props.bgColor);
    		if ('iconClass' in $$props) $$invalidate(19, iconClass = $$new_props.iconClass);
    		if ('disabled' in $$props) $$invalidate(20, disabled = $$new_props.disabled);
    		if ('add' in $$props) $$invalidate(32, add = $$new_props.add);
    		if ('remove' in $$props) $$invalidate(33, remove = $$new_props.remove);
    		if ('replace' in $$props) $$invalidate(34, replace = $$new_props.replace);
    		if ('inputClasses' in $$props) $$invalidate(35, inputClasses = $$new_props.inputClasses);
    		if ('classes' in $$props) $$invalidate(36, classes = $$new_props.classes);
    		if ('appendClasses' in $$props) $$invalidate(37, appendClasses = $$new_props.appendClasses);
    		if ('prependClasses' in $$props) $$invalidate(38, prependClasses = $$new_props.prependClasses);
    		if ('extend' in $$props) $$invalidate(39, extend = $$new_props.extend);
    		if ('focused' in $$props) $$invalidate(1, focused = $$new_props.focused);
    		if ('wClasses' in $$props) $$invalidate(21, wClasses = $$new_props.wClasses);
    		if ('aClasses' in $$props) $$invalidate(22, aClasses = $$new_props.aClasses);
    		if ('pClasses' in $$props) $$invalidate(23, pClasses = $$new_props.pClasses);
    		if ('iClasses' in $$props) $$invalidate(24, iClasses = $$new_props.iClasses);
    		if ('labelOnTop' in $$props) $$invalidate(25, labelOnTop = $$new_props.labelOnTop);
    		if ('showHint' in $$props) $$invalidate(26, showHint = $$new_props.showHint);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*error, hint, focused*/ 98 | $$self.$$.dirty[1] & /*persistentHint*/ 1) {
    			$$invalidate(26, showHint = error || (persistentHint ? hint : focused && hint));
    		}

    		if ($$self.$$.dirty[0] & /*placeholder, focused, value*/ 19) {
    			$$invalidate(25, labelOnTop = placeholder || focused || (value || value === 0));
    		}

    		$$invalidate(24, iClasses = cb.flush().remove('pt-6 pb-2', outlined).add('border rounded bg-transparent py-4 duration-200 ease-in', outlined).add('border-error-500 caret-error-500', error).remove(caret(), error).add(caret(), !error).add(border(), outlined && focused && !error).add('bg-gray-100 dark:bg-dark-600', !outlined).add('bg-gray-300 dark:bg-dark-200', focused && !outlined).remove('px-4', prepend).add('pr-4 pl-10', prepend).add(add).remove('pt-6 pb-2', dense && !outlined).add('pt-4 pb-1', dense && !outlined).remove('bg-gray-100', disabled).add('bg-gray-50', disabled).add('cursor-pointer', select && !autocomplete).add($$props.class).remove(remove).replace(replace).extend(extend).get());

    		if ($$self.$$.dirty[0] & /*select, autocomplete, dense, outlined, error, disabled*/ 1062980) {
    			$$invalidate(21, wClasses = ccb.flush().add('select', select || autocomplete).add('dense', dense && !outlined).remove('mb-6 mt-2', dense && !outlined).add('mb-4 mt-1', dense).replace({ 'text-gray-600': 'text-error-500' }, error).add('text-gray-200', disabled).get());
    		}
    	};

    	$$invalidate(22, aClasses = acb.flush().get());
    	$$invalidate(23, pClasses = pcb.flush().get());
    	$$props = exclude_internal_props($$props);

    	return [
    		value,
    		focused,
    		outlined,
    		label,
    		placeholder,
    		hint,
    		error,
    		append,
    		prepend,
    		textarea,
    		rows,
    		select,
    		dense,
    		autocomplete,
    		noUnderline,
    		appendReverse,
    		prependReverse,
    		color,
    		bgColor,
    		iconClass,
    		disabled,
    		wClasses,
    		aClasses,
    		pClasses,
    		iClasses,
    		labelOnTop,
    		showHint,
    		txt,
    		toggleFocused,
    		props,
    		dispatch,
    		persistentHint,
    		add,
    		remove,
    		replace,
    		inputClasses,
    		classes,
    		appendClasses,
    		prependClasses,
    		extend,
    		slots,
    		blur_handler,
    		change_handler,
    		input_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		click_handler,
    		focus_handler,
    		change_handler_1,
    		input_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		click_handler_1,
    		focus_handler_1,
    		blur_handler_1,
    		change_handler_2,
    		input_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		click_handler_2,
    		blur_handler_2,
    		focus_handler_2,
    		input_input_handler,
    		textarea_1_input_handler,
    		click_handler_3,
    		click_handler_4,
    		$$scope
    	];
    }

    class TextField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				outlined: 2,
    				value: 0,
    				label: 3,
    				placeholder: 4,
    				hint: 5,
    				error: 6,
    				append: 7,
    				prepend: 8,
    				persistentHint: 31,
    				textarea: 9,
    				rows: 10,
    				select: 11,
    				dense: 12,
    				autocomplete: 13,
    				noUnderline: 14,
    				appendReverse: 15,
    				prependReverse: 16,
    				color: 17,
    				bgColor: 18,
    				iconClass: 19,
    				disabled: 20,
    				add: 32,
    				remove: 33,
    				replace: 34,
    				inputClasses: 35,
    				classes: 36,
    				appendClasses: 37,
    				prependClasses: 38,
    				extend: 39,
    				focused: 1
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextField",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get outlined() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hint() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hint(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get append() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set append(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prepend() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prepend(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistentHint() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistentHint(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textarea() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textarea(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autocomplete() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autocomplete(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noUnderline() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noUnderline(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get appendReverse() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appendReverse(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prependReverse() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prependReverse(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgColor() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClass() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClass(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get add() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set add(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClasses() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClasses(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get appendClasses() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appendClasses(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prependClasses() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prependClasses(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extend() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extend(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focused() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focused(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function withColor(color, store) {
      return message =>
        store.update(u => [
          ...u,
          {
            message,
            ts: new Date(),
            color,
            toString() {
              return message;
            }
          }
        ]);
    }

    function notificationQueue() {
      const store = writable([]);

      return {
        subscribe: store.subscribe,

        notify: withColor("gray", store),
        error: withColor("error", store),
        alert: withColor("alert", store),

        remove: i =>
          store.update(u => {
            u.splice(i, 1);
            return u;
          })
      };
    }

    /* node_modules/smelte/src/components/Snackbar/Notifications.svelte generated by Svelte v3.44.3 */

    notificationQueue();

    /* src/shared/loader/FacebookLoader.svelte generated by Svelte v3.44.3 */

    const file$8 = "src/shared/loader/FacebookLoader.svelte";

    function create_fragment$9(ctx) {
    	let div3;
    	let div0;
    	let div1;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			div1 = element("div");
    			div2 = element("div");
    			attr_dev(div0, "class", "svelte-1uvbc2p");
    			add_location(div0, file$8, 0, 26, 26);
    			attr_dev(div1, "class", "svelte-1uvbc2p");
    			add_location(div1, file$8, 0, 37, 37);
    			attr_dev(div2, "class", "svelte-1uvbc2p");
    			add_location(div2, file$8, 0, 48, 48);
    			attr_dev(div3, "class", "lds-facebook svelte-1uvbc2p");
    			add_location(div3, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, div1);
    			append_dev(div3, div2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FacebookLoader', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FacebookLoader> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FacebookLoader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FacebookLoader",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    class Stack {
      constructor(options) {
        // TODO: label for close all button
        Object.assign(
          this,
          {
            dir1: null,
            dir2: null,
            firstpos1: null,
            firstpos2: null,
            spacing1: 25,
            spacing2: 25,
            push: 'bottom',
            maxOpen: 1,
            maxStrategy: 'wait',
            maxClosureCausesWait: true,
            modal: 'ish',
            modalishFlash: true,
            overlayClose: true,
            overlayClosesPinned: false,
            positioned: true,
            context: (window && document.body) || null
          },
          options
        );

        // Validate the options.
        if (this.modal === 'ish' && this.maxOpen !== 1) {
          throw new Error('A modalish stack must have a maxOpen value of 1.');
        }
        if (this.modal === 'ish' && !this.dir1) {
          throw new Error('A modalish stack must have a direction.');
        }
        if (
          this.push === 'top' &&
          this.modal === 'ish' &&
          this.maxStrategy !== 'close'
        ) {
          throw new Error(
            'A modalish stack that pushes to the top must use the close maxStrategy.'
          );
        }

        // -- Private properties.

        // The head of the notice double linked list.
        this._noticeHead = {
          notice: null,
          prev: null,
          next: null
        };
        // The tail of the notice double linked list.
        this._noticeTail = {
          notice: null,
          prev: this._noticeHead,
          next: null
        };
        this._noticeHead.next = this._noticeTail;
        // The map of notices to nodes.
        this._noticeMap = new WeakMap();
        // The number of notices in the stack.
        this._length = 0;

        // How much space to add along the secondary axis when moving notices to the
        // next column/row.
        this._addpos2 = 0;
        // Whether the stack's notices should animate while moving.
        this._animation = true;
        // A timer to debounce positioning.
        this._posTimer = null;
        // The number of open notices.
        this._openNotices = 0;
        // A listener for positioning events.
        this._listener = null;
        // Whether the overlay is currently open.
        this._overlayOpen = false;
        // Whether the overlay is currently inserted into the DOM.
        this._overlayInserted = false;
        // Whether the modal state is collapsing. (Notices go back to waiting and
        // shouldn't resposition.)
        this._collapsingModalState = false;
        // The leader is the first open notice in a modalish stack.
        this._leader = null;
        this._leaderOff = null;
        // The next waiting notice that is masking.
        this._masking = null;
        this._maskingOff = null;
        // Swapping notices, so don't open a new one. Set to the opening notice on
        // swap.
        this._swapping = false;
        // Event listener callbacks.
        this._callbacks = {};
      }

      get notices() {
        const notices = [];
        this.forEach(notice => notices.push(notice));
        return notices;
      }

      get length() {
        return this._length;
      }

      get leader() {
        return this._leader;
      }

      forEach(
        callback,
        { start = 'oldest', dir = 'newer', skipModuleHandled = false } = {}
      ) {
        let node;
        if (
          start === 'head' ||
          (start === 'newest' && this.push === 'top') ||
          (start === 'oldest' && this.push === 'bottom')
        ) {
          node = this._noticeHead.next;
        } else if (
          start === 'tail' ||
          (start === 'newest' && this.push === 'bottom') ||
          (start === 'oldest' && this.push === 'top')
        ) {
          node = this._noticeTail.prev;
        } else if (this._noticeMap.has(start)) {
          node = this._noticeMap.get(start);
        } else {
          throw new Error('Invalid start param.');
        }
        while (node.notice) {
          const notice = node.notice;
          // Get the next node first.
          if (
            dir === 'prev' ||
            (this.push === 'top' && dir === 'newer') ||
            (this.push === 'bottom' && dir === 'older')
          ) {
            node = node.prev;
          } else if (
            dir === 'next' ||
            (this.push === 'top' && dir === 'older') ||
            (this.push === 'bottom' && dir === 'newer')
          ) {
            node = node.next;
          } else {
            throw new Error('Invalid dir param.');
          }
          // Call the callback last, just in case the callback removes the notice.
          if (
            (!skipModuleHandled || !notice.getModuleHandled()) &&
            callback(notice) === false
          ) {
            break;
          }
        }
      }

      close(immediate) {
        this.forEach(notice => notice.close(immediate, false, false));
      }

      open(immediate) {
        this.forEach(notice => notice.open(immediate));
      }

      openLast() {
        // Look up the last notice, and display it.
        this.forEach(
          notice => {
            if (['opening', 'open', 'waiting'].indexOf(notice.getState()) === -1) {
              notice.open();
              return false;
            }
          },
          { start: 'newest', dir: 'older' }
        );
      }

      swap(one, theOther, immediate = false, waitAfter = false) {
        if (['open', 'opening', 'closing'].indexOf(one.getState()) === -1) {
          // One is closed. Return rejected promise.
          return Promise.reject();
        }
        this._swapping = theOther;
        return one
          .close(immediate, false, waitAfter)
          .then(() => theOther.open(immediate))
          .finally(() => {
            this._swapping = false;
          });
      }

      on(event, callback) {
        if (!(event in this._callbacks)) {
          this._callbacks[event] = [];
        }
        this._callbacks[event].push(callback);
        return () => {
          this._callbacks[event].splice(
            this._callbacks[event].indexOf(callback),
            1
          );
        };
      }

      fire(event, detail = {}) {
        detail.stack = this;
        if (event in this._callbacks) {
          this._callbacks[event].forEach(cb => cb(detail));
        }
      }

      position() {
        // Reset the next position data.
        if (this.positioned && this._length > 0) {
          this.fire('beforePosition');
          this._resetPositionData();
          this.forEach(
            notice => {
              this._positionNotice(notice);
            },
            { start: 'head', dir: 'next', skipModuleHandled: true }
          );
          this.fire('afterPosition');
        } else {
          delete this._nextpos1;
          delete this._nextpos2;
        }
      }

      // Queue the position so it doesn't run repeatedly and use up resources.
      queuePosition(milliseconds = 10) {
        if (this._posTimer) {
          clearTimeout(this._posTimer);
        }
        this._posTimer = setTimeout(() => this.position(), milliseconds);
      }

      _resetPositionData() {
        this._nextpos1 = this.firstpos1;
        this._nextpos2 = this.firstpos2;
        this._addpos2 = 0;
      }

      // Position the notice.
      _positionNotice(notice, masking = notice === this._masking) {
        if (!this.positioned) {
          return;
        }

        // Get the notice's element.
        const elem = notice.refs.elem;
        if (!elem) {
          return;
        }

        // Skip this notice if it's not shown.
        if (
          !elem.classList.contains('pnotify-in') &&
          !elem.classList.contains('pnotify-initial') &&
          !masking
        ) {
          return;
        }

        // Use local variables, since a masking notice position shouldn't update the
        // stack.
        let [firstpos1, firstpos2, _nextpos1, _nextpos2, _addpos2] = [
          this.firstpos1,
          this.firstpos2,
          this._nextpos1,
          this._nextpos2,
          this._addpos2
        ];

        // Read from the DOM to cause refresh.
        elem.getBoundingClientRect();

        if (this._animation && !masking && !this._collapsingModalState) {
          // Add animate class.
          notice._setMoveClass('pnotify-move');
        } else {
          notice._setMoveClass('');
        }

        const spaceY =
          this.context === document.body
            ? window.innerHeight
            : this.context.scrollHeight;
        const spaceX =
          this.context === document.body
            ? window.innerWidth
            : this.context.scrollWidth;

        let csspos1;

        if (this.dir1) {
          csspos1 = {
            down: 'top',
            up: 'bottom',
            left: 'right',
            right: 'left'
          }[this.dir1];

          // Calculate the current pos1 value.
          let curpos1;
          switch (this.dir1) {
            case 'down':
              curpos1 = elem.offsetTop;
              break;
            case 'up':
              curpos1 = spaceY - elem.scrollHeight - elem.offsetTop;
              break;
            case 'left':
              curpos1 = spaceX - elem.scrollWidth - elem.offsetLeft;
              break;
            case 'right':
              curpos1 = elem.offsetLeft;
              break;
          }
          // Remember the first pos1, so the first notice goes there.
          if (firstpos1 == null) {
            firstpos1 = curpos1;
            _nextpos1 = firstpos1;
          }
        }

        if (this.dir1 && this.dir2) {
          const csspos2 = {
            down: 'top',
            up: 'bottom',
            left: 'right',
            right: 'left'
          }[this.dir2];

          // Calculate the current pos2 value.
          let curpos2;
          switch (this.dir2) {
            case 'down':
              curpos2 = elem.offsetTop;
              break;
            case 'up':
              curpos2 = spaceY - elem.scrollHeight - elem.offsetTop;
              break;
            case 'left':
              curpos2 = spaceX - elem.scrollWidth - elem.offsetLeft;
              break;
            case 'right':
              curpos2 = elem.offsetLeft;
              break;
          }
          // Remember the first pos2, so the first notice goes there.
          if (firstpos2 == null) {
            firstpos2 = curpos2;
            _nextpos2 = firstpos2;
          }

          // Don't move masking notices along dir2. They should always be beside the
          // leader along dir1.
          if (!masking) {
            // Check that it's not beyond the viewport edge.
            const endY = _nextpos1 + elem.offsetHeight + this.spacing1;
            const endX = _nextpos1 + elem.offsetWidth + this.spacing1;
            if (
              ((this.dir1 === 'down' || this.dir1 === 'up') && endY > spaceY) ||
              ((this.dir1 === 'left' || this.dir1 === 'right') && endX > spaceX)
            ) {
              // If it is, it needs to go back to the first pos1, and over on pos2.
              _nextpos1 = firstpos1;
              _nextpos2 += _addpos2 + this.spacing2;
              _addpos2 = 0;
            }
          }

          // Move the notice on dir2.
          if (_nextpos2 != null) {
            elem.style[csspos2] = `${_nextpos2}px`;
            if (!this._animation) {
              elem.style[csspos2]; // Read from the DOM for update.
            }
          }

          // Keep track of the widest/tallest notice in the column/row, so we can push the next column/row.
          switch (this.dir2) {
            case 'down':
            case 'up':
              if (
                elem.offsetHeight +
                  (parseFloat(elem.style.marginTop, 10) || 0) +
                  (parseFloat(elem.style.marginBottom, 10) || 0) >
                _addpos2
              ) {
                _addpos2 = elem.offsetHeight;
              }
              break;
            case 'left':
            case 'right':
              if (
                elem.offsetWidth +
                  (parseFloat(elem.style.marginLeft, 10) || 0) +
                  (parseFloat(elem.style.marginRight, 10) || 0) >
                _addpos2
              ) {
                _addpos2 = elem.offsetWidth;
              }
              break;
          }
        } else if (this.dir1) {
          // Center the notice along dir1 axis, because the stack has no dir2.
          let cssMiddle, cssposCross;
          switch (this.dir1) {
            case 'down':
            case 'up':
              cssposCross = ['left', 'right'];
              cssMiddle = this.context.scrollWidth / 2 - elem.offsetWidth / 2;
              break;
            case 'left':
            case 'right':
              cssposCross = ['top', 'bottom'];
              cssMiddle = spaceY / 2 - elem.offsetHeight / 2;
              break;
          }
          elem.style[cssposCross[0]] = `${cssMiddle}px`;
          elem.style[cssposCross[1]] = 'auto';
          if (!this._animation) {
            elem.style[cssposCross[0]]; // Read from the DOM for update.
          }
        }

        if (this.dir1) {
          // Move the notice on dir1.
          if (_nextpos1 != null) {
            elem.style[csspos1] = `${_nextpos1}px`;
            if (!this._animation) {
              elem.style[csspos1]; // Read from the DOM for update.
            }
          }

          // Calculate the next dir1 position.
          switch (this.dir1) {
            case 'down':
            case 'up':
              _nextpos1 += elem.offsetHeight + this.spacing1;
              break;
            case 'left':
            case 'right':
              _nextpos1 += elem.offsetWidth + this.spacing1;
              break;
          }
        } else {
          // Center the notice on the screen, because the stack has no dir1.
          const cssMiddleLeft = spaceX / 2 - elem.offsetWidth / 2;
          const cssMiddleTop = spaceY / 2 - elem.offsetHeight / 2;
          elem.style.left = `${cssMiddleLeft}px`;
          elem.style.top = `${cssMiddleTop}px`;
          if (!this._animation) {
            elem.style.left; // Read from the DOM for update.
          }
        }

        // If we're not positioning the masking notice, update the stack properties.
        if (!masking) {
          this.firstpos1 = firstpos1;
          this.firstpos2 = firstpos2;
          this._nextpos1 = _nextpos1;
          this._nextpos2 = _nextpos2;
          this._addpos2 = _addpos2;
        }
      }

      _addNotice(notice) {
        this.fire('beforeAddNotice', { notice });

        const handleNoticeOpen = () => {
          this.fire('beforeOpenNotice', { notice });

          if (notice.getModuleHandled()) {
            // We don't deal with notices that are handled by a module.
            this.fire('afterOpenNotice', { notice });
            return;
          }

          this._openNotices++;

          // Check the max in stack.
          if (
            !(this.modal === 'ish' && this._overlayOpen) &&
            this.maxOpen !== Infinity &&
            this._openNotices > this.maxOpen &&
            this.maxStrategy === 'close'
          ) {
            let toClose = this._openNotices - this.maxOpen;
            this.forEach(notice => {
              if (['opening', 'open'].indexOf(notice.getState()) !== -1) {
                // Close oldest notices, leaving only stack.maxOpen from the stack.
                notice.close(false, false, this.maxClosureCausesWait);
                if (notice === this._leader) {
                  this._setLeader(null);
                }
                toClose--;
                return !!toClose;
              }
            });
          }

          if (this.modal === true) {
            this._insertOverlay();
          }

          if (
            this.modal === 'ish' &&
            (!this._leader ||
              ['opening', 'open', 'closing'].indexOf(this._leader.getState()) ===
                -1)
          ) {
            this._setLeader(notice);
          }

          if (this.modal === 'ish' && this._overlayOpen) {
            notice._preventTimerClose(true);
          }

          // this.queuePosition(0);

          this.fire('afterOpenNotice', { notice });
        };

        const handleNoticeClosed = () => {
          this.fire('beforeCloseNotice', { notice });

          if (notice.getModuleHandled()) {
            // We don't deal with notices that are handled by a module.
            this.fire('afterCloseNotice', { notice });
            return;
          }

          this._openNotices--;

          if (this.modal === 'ish' && notice === this._leader) {
            this._setLeader(null);
            if (this._masking) {
              this._setMasking(null);
            }
          }

          if (
            !this._swapping &&
            this.maxOpen !== Infinity &&
            this._openNotices < this.maxOpen
          ) {
            let done = false;
            const open = contender => {
              if (contender !== notice && contender.getState() === 'waiting') {
                contender.open().catch(() => {});
                if (this._openNotices >= this.maxOpen) {
                  done = true;
                  return false;
                }
              }
            };
            if (this.maxStrategy === 'wait') {
              // Check for the next waiting notice and open it.
              this.forEach(open, {
                start: notice,
                dir: 'next'
              });
              if (!done) {
                this.forEach(open, {
                  start: notice,
                  dir: 'prev'
                });
              }
            } else if (this.maxStrategy === 'close' && this.maxClosureCausesWait) {
              // Check for the last closed notice and re-open it.
              this.forEach(open, {
                start: notice,
                dir: 'older'
              });
              if (!done) {
                this.forEach(open, {
                  start: notice,
                  dir: 'newer'
                });
              }
            }
          }

          if (this._openNotices <= 0) {
            this._openNotices = 0;
            this._resetPositionData();

            if (this._overlayOpen && !this._swapping) {
              this._removeOverlay();
            }
          } else if (!this._collapsingModalState) {
            this.queuePosition(0);
          }

          this.fire('afterCloseNotice', { notice });
        };

        // This is the linked list node.
        const node = {
          notice,
          prev: null,
          next: null,
          beforeOpenOff: notice.on('pnotify:beforeOpen', handleNoticeOpen),
          afterCloseOff: notice.on('pnotify:afterClose', handleNoticeClosed)
        };

        // Push to the correct side of the linked list.
        if (this.push === 'top') {
          node.next = this._noticeHead.next;
          node.prev = this._noticeHead;
          node.next.prev = node;
          node.prev.next = node;
        } else {
          node.prev = this._noticeTail.prev;
          node.next = this._noticeTail;
          node.prev.next = node;
          node.next.prev = node;
        }

        // Add to the map.
        this._noticeMap.set(notice, node);

        // Increment the length to match.
        this._length++;

        if (!this._listener) {
          this._listener = () => this.position();
          this.context.addEventListener('pnotify:position', this._listener);
        }

        if (['open', 'opening', 'closing'].indexOf(notice.getState()) !== -1) {
          // If the notice is already open, handle it immediately.
          handleNoticeOpen();
        } else if (
          this.modal === 'ish' &&
          this.modalishFlash &&
          this._shouldNoticeWait(notice)
        ) {
          // If it's not open, and it's going to be a waiting notice, flash it.
          const off = notice.on('pnotify:mount', () => {
            off();
            notice._setMasking(true, false, () => {
              notice._setMasking(false);
            });
            this._resetPositionData();
            this._positionNotice(this._leader);
            window.requestAnimationFrame(() => {
              this._positionNotice(notice, true);
            });
          });
        }

        this.fire('afterAddNotice', { notice });
      }

      _removeNotice(notice) {
        if (!this._noticeMap.has(notice)) {
          return;
        }

        this.fire('beforeRemoveNotice', { notice });

        const node = this._noticeMap.get(notice);

        if (this._leader === notice) {
          // Clear the leader.
          this._setLeader(null);
        }

        if (this._masking === notice) {
          // Clear masking.
          this._setMasking(null);
        }

        // Remove the notice from the linked list.
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node.prev = null;
        node.next = null;
        node.beforeOpenOff();
        node.beforeOpenOff = null;
        node.afterCloseOff();
        node.afterCloseOff = null;

        // Remove the notice from the map.
        this._noticeMap.delete(notice);

        // Reduce the length to match.
        this._length--;

        if (!this._length && this._listener) {
          // Remove the listener.
          this.context.removeEventListener('pnotify:position', this._listener);
          this._listener = null;
        }

        if (!this._length && this._overlayOpen) {
          this._removeOverlay();
        }

        // If the notice is open, handle it as if it had closed.
        if (['open', 'opening', 'closing'].indexOf(notice.getState()) !== -1) {
          this._handleNoticeClosed(notice);
        }

        this.fire('afterRemoveNotice', { notice });
      }

      _setLeader(leader) {
        this.fire('beforeSetLeader', { leader });

        if (this._leaderOff) {
          this._leaderOff();
          this._leaderOff = null;
        }

        this._leader = leader;

        if (!this._leader) {
          this.fire('afterSetLeader', { leader });
          return;
        }

        // If the mouse enters this notice while it's the leader, then the next
        // waiting notice should start masking.
        const leaderInteraction = () => {
          // This is a workaround for leaving the modal state.
          let nextNoticeFromModalState = null;

          // If the leader is moused over:
          if (this._overlayOpen) {
            this._collapsingModalState = true;

            this.forEach(
              notice => {
                // Allow the notices to timed close.
                notice._preventTimerClose(false);

                // Close and set to wait any open notices other than the leader.
                if (
                  notice !== this._leader &&
                  ['opening', 'open'].indexOf(notice.getState()) !== -1
                ) {
                  if (!nextNoticeFromModalState) {
                    nextNoticeFromModalState = notice;
                  }
                  notice.close(notice === nextNoticeFromModalState, false, true);
                }
              },
              {
                start: this._leader,
                dir: 'next',
                skipModuleHandled: true
              }
            );

            // Remove the modal state overlay.
            this._removeOverlay();
          }

          // Turn off any masking off timer that may still be running.
          if (maskingOffTimer) {
            clearTimeout(maskingOffTimer);
            maskingOffTimer = null;
          }

          // Set the next waiting notice to be masking.
          this.forEach(
            notice => {
              if (notice === this._leader) {
                // Skip the leader, and start with the next one.
                return;
              }
              // The next notice that is "waiting" is usually fine, but if we're
              // leaving the modal state, it will still be "closing" here, so we have
              // to work around that. :P
              // Also, when coming back from modal state, the notice should
              // immediately be masking instead of fading in.
              if (
                notice.getState() === 'waiting' ||
                notice === nextNoticeFromModalState
              ) {
                this._setMasking(notice, !!nextNoticeFromModalState);
                return false;
              }
            },
            {
              start: this._leader,
              dir: 'next',
              skipModuleHandled: true
            }
          );
        };

        // If the mouse leaves this notice while it's the leader, then the next
        // waiting notice should stop masking.
        let maskingOffTimer = null;
        const leaderLeaveInteraction = () => {
          if (maskingOffTimer) {
            clearTimeout(maskingOffTimer);
            maskingOffTimer = null;
          }
          // TODO: Something wrong here when you come right back from the modal state.
          maskingOffTimer = setTimeout(() => {
            maskingOffTimer = null;
            this._setMasking(null);
          }, 750);
        };

        this._leaderOff = (offs => () => offs.map(off => off()))([
          this._leader.on('mouseenter', leaderInteraction),
          this._leader.on('focusin', leaderInteraction),
          this._leader.on('mouseleave', leaderLeaveInteraction),
          this._leader.on('focusout', leaderLeaveInteraction)
        ]);

        this.fire('afterSetLeader', { leader });
      }

      _setMasking(masking, immediate) {
        if (this._masking) {
          if (this._masking === masking) {
            // Nothing to do.
            return;
          }
          this._masking._setMasking(false, immediate);
        }

        if (this._maskingOff) {
          this._maskingOff();
          this._maskingOff = null;
        }

        this._masking = masking;

        if (!this._masking) {
          return;
        }

        // Reset the position data and position the leader.
        this._resetPositionData();
        if (this._leader) {
          this._positionNotice(this._leader);
        }

        // Get this notice ready for positioning.
        this._masking._setMasking(true, immediate);

        // Wait for the DOM to update.
        window.requestAnimationFrame(() => {
          if (this._masking) {
            this._positionNotice(this._masking);
          }
        });

        const maskingInteraction = () => {
          // If the masked notice is moused over or focused, the stack enters the
          // modal state, and the notices appear.
          if (this.modal === 'ish') {
            this._insertOverlay();

            this._setMasking(null, true);

            this.forEach(
              notice => {
                // Prevent the notices from timed closing.
                notice._preventTimerClose(true);

                if (notice.getState() === 'waiting') {
                  notice.open();
                }
              },
              {
                start: this._leader,
                dir: 'next',
                skipModuleHandled: true
              }
            );
          }
        };

        this._maskingOff = (offs => () => offs.map(off => off()))([
          this._masking.on('mouseenter', maskingInteraction),
          this._masking.on('focusin', maskingInteraction)
        ]);
      }

      _shouldNoticeWait(notice) {
        return (
          this._swapping !== notice &&
          !(this.modal === 'ish' && this._overlayOpen) &&
          this.maxOpen !== Infinity &&
          this._openNotices >= this.maxOpen &&
          this.maxStrategy === 'wait'
        );
      }

      _insertOverlay() {
        if (!this._overlay) {
          this._overlay = document.createElement('div');
          this._overlay.classList.add('pnotify-modal-overlay');
          if (this.dir1) {
            this._overlay.classList.add(`pnotify-modal-overlay-${this.dir1}`);
          }
          if (this.overlayClose) {
            this._overlay.classList.add('pnotify-modal-overlay-closes');
          }
          if (this.context !== document.body) {
            this._overlay.style.height = `${this.context.scrollHeight}px`;
            this._overlay.style.width = `${this.context.scrollWidth}px`;
          }
          // Close the notices on overlay click.
          this._overlay.addEventListener('click', clickEvent => {
            if (this.overlayClose) {
              this.fire('overlayClose', { clickEvent });

              if (clickEvent.defaultPrevented) {
                return;
              }

              if (this._leader) {
                // Clear the leader. A new one will be found while closing.
                this._setLeader(null);
              }

              this.forEach(
                notice => {
                  if (
                    ['closed', 'closing', 'waiting'].indexOf(notice.getState()) !==
                    -1
                  ) {
                    return;
                  }
                  if (notice.hide || this.overlayClosesPinned) {
                    notice.close();
                  } else if (!notice.hide && this.modal === 'ish') {
                    if (this._leader) {
                      notice.close(false, false, true);
                    } else {
                      this._setLeader(notice);
                    }
                  }
                },
                {
                  skipModuleHandled: true
                }
              );

              if (this._overlayOpen) {
                this._removeOverlay();
              }
            }
          });
        }
        if (this._overlay.parentNode !== this.context) {
          this.fire('beforeAddOverlay');
          this._overlay.classList.remove('pnotify-modal-overlay-in');
          this._overlay = this.context.insertBefore(
            this._overlay,
            this.context.firstChild
          );
          this._overlayOpen = true;
          this._overlayInserted = true;
          window.requestAnimationFrame(() => {
            this._overlay.classList.add('pnotify-modal-overlay-in');
            this.fire('afterAddOverlay');
          });
        }
        this._collapsingModalState = false;
      }

      _removeOverlay() {
        if (this._overlay.parentNode) {
          this.fire('beforeRemoveOverlay');

          this._overlay.classList.remove('pnotify-modal-overlay-in');
          this._overlayOpen = false;
          setTimeout(() => {
            this._overlayInserted = false;
            if (this._overlay.parentNode) {
              this._overlay.parentNode.removeChild(this._overlay);
              this.fire('afterRemoveOverlay');
            }
          }, 250);
          setTimeout(() => {
            this._collapsingModalState = false;
          }, 400);
        }
      }
    }

    const component = (...args) => new Core(...args);

    function forwardEventsBuilder(component, additionalEvents = []) {
      // prettier-ignore
      const events = [
        'focus', 'blur',
        'fullscreenchange', 'fullscreenerror', 'scroll',
        'cut', 'copy', 'paste',
        'keydown', 'keypress', 'keyup',
        'auxclick', 'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup', 'pointerlockchange', 'pointerlockerror', 'select', 'wheel',
        'drag', 'dragend', 'dragenter', 'dragstart', 'dragleave', 'dragover', 'drop',
        'touchcancel', 'touchend', 'touchmove', 'touchstart',
        'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave', 'gotpointercapture', 'lostpointercapture',
        ...additionalEvents
      ];

      function forward(e) {
        bubble(component, e);
      }

      return node => {
        const destructors = [];

        for (let i = 0; i < events.length; i++) {
          destructors.push(listen(node, events[i], forward));
        }

        return {
          destroy: () => {
            for (let i = 0; i < destructors.length; i++) {
              destructors[i]();
            }
          }
        };
      };
    }

    /* node_modules/@pnotify/core/index.svelte generated by Svelte v3.44.3 */

    const { Error: Error_1, Map: Map_1 } = globals;
    const file$7 = "node_modules/@pnotify/core/index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[109] = list[i][0];
    	child_ctx[110] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[109] = list[i][0];
    	child_ctx[110] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[109] = list[i][0];
    	child_ctx[110] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[109] = list[i][0];
    	child_ctx[110] = list[i][1];
    	return child_ctx;
    }

    // (931:4) {#each modulesPrependContainer as [module, options] (module)}
    function create_each_block_3(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ self: /*self*/ ctx[42] }, /*options*/ ctx[110]];
    	var switch_value = /*module*/ ctx[109].default;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[1] & /*self, modulesPrependContainer*/ 2080)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[1] & /*self*/ 2048 && { self: /*self*/ ctx[42] },
    					dirty[1] & /*modulesPrependContainer*/ 32 && get_spread_object(/*options*/ ctx[110])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*module*/ ctx[109].default)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(931:4) {#each modulesPrependContainer as [module, options] (module)}",
    		ctx
    	});

    	return block;
    }

    // (934:4) {#if closer && !_nonBlock}
    function create_if_block_8(ctx) {
    	let div;
    	let span;
    	let div_class_value;
    	let div_title_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			attr_dev(span, "class", /*getIcon*/ ctx[22]('closer'));
    			add_location(span, file$7, 941, 8, 26647);

    			attr_dev(div, "class", div_class_value = `pnotify-closer ${/*getStyle*/ ctx[21]('closer')} ${(!/*closerHover*/ ctx[17] || /*_interacting*/ ctx[29]) && !/*_masking*/ ctx[31]
			? ''
			: 'pnotify-hidden'}`);

    			attr_dev(div, "role", "button");
    			attr_dev(div, "tabindex", "0");
    			attr_dev(div, "title", div_title_value = /*labels*/ ctx[20].close);
    			add_location(div, file$7, 934, 6, 26390);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[84], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*closerHover, _interacting*/ 537001984 | dirty[1] & /*_masking*/ 1 && div_class_value !== (div_class_value = `pnotify-closer ${/*getStyle*/ ctx[21]('closer')} ${(!/*closerHover*/ ctx[17] || /*_interacting*/ ctx[29]) && !/*_masking*/ ctx[31]
			? ''
			: 'pnotify-hidden'}`)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty[0] & /*labels*/ 1048576 && div_title_value !== (div_title_value = /*labels*/ ctx[20].close)) {
    				attr_dev(div, "title", div_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(934:4) {#if closer && !_nonBlock}",
    		ctx
    	});

    	return block;
    }

    // (945:4) {#if sticker && !_nonBlock}
    function create_if_block_7(ctx) {
    	let div;
    	let span;
    	let span_class_value;
    	let div_class_value;
    	let div_aria_pressed_value;
    	let div_title_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");

    			attr_dev(span, "class", span_class_value = `${/*getIcon*/ ctx[22]('sticker')} ${/*hide*/ ctx[3]
			? /*getIcon*/ ctx[22]('unstuck')
			: /*getIcon*/ ctx[22]('stuck')}`);

    			add_location(span, file$7, 953, 8, 27058);

    			attr_dev(div, "class", div_class_value = `pnotify-sticker ${/*getStyle*/ ctx[21]('sticker')} ${(!/*stickerHover*/ ctx[19] || /*_interacting*/ ctx[29]) && !/*_masking*/ ctx[31]
			? ''
			: 'pnotify-hidden'}`);

    			attr_dev(div, "role", "button");
    			attr_dev(div, "aria-pressed", div_aria_pressed_value = !/*hide*/ ctx[3]);
    			attr_dev(div, "tabindex", "0");

    			attr_dev(div, "title", div_title_value = /*hide*/ ctx[3]
    			? /*labels*/ ctx[20].stick
    			: /*labels*/ ctx[20].unstick);

    			add_location(div, file$7, 945, 6, 26743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_1*/ ctx[85], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hide*/ 8 && span_class_value !== (span_class_value = `${/*getIcon*/ ctx[22]('sticker')} ${/*hide*/ ctx[3]
			? /*getIcon*/ ctx[22]('unstuck')
			: /*getIcon*/ ctx[22]('stuck')}`)) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty[0] & /*stickerHover, _interacting*/ 537395200 | dirty[1] & /*_masking*/ 1 && div_class_value !== (div_class_value = `pnotify-sticker ${/*getStyle*/ ctx[21]('sticker')} ${(!/*stickerHover*/ ctx[19] || /*_interacting*/ ctx[29]) && !/*_masking*/ ctx[31]
			? ''
			: 'pnotify-hidden'}`)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty[0] & /*hide*/ 8 && div_aria_pressed_value !== (div_aria_pressed_value = !/*hide*/ ctx[3])) {
    				attr_dev(div, "aria-pressed", div_aria_pressed_value);
    			}

    			if (dirty[0] & /*hide, labels*/ 1048584 && div_title_value !== (div_title_value = /*hide*/ ctx[3]
    			? /*labels*/ ctx[20].stick
    			: /*labels*/ ctx[20].unstick)) {
    				attr_dev(div, "title", div_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(945:4) {#if sticker && !_nonBlock}",
    		ctx
    	});

    	return block;
    }

    // (959:4) {#if icon !== false}
    function create_if_block_6(ctx) {
    	let div;
    	let span;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");

    			attr_dev(span, "class", span_class_value = /*icon*/ ctx[13] === true
    			? /*getIcon*/ ctx[22](/*type*/ ctx[4])
    			: /*icon*/ ctx[13]);

    			add_location(span, file$7, 963, 8, 27330);
    			attr_dev(div, "class", `pnotify-icon ${/*getStyle*/ ctx[21]('icon')}`);
    			add_location(div, file$7, 959, 6, 27219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			/*div_binding*/ ctx[86](div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*icon, type*/ 8208 && span_class_value !== (span_class_value = /*icon*/ ctx[13] === true
    			? /*getIcon*/ ctx[22](/*type*/ ctx[4])
    			: /*icon*/ ctx[13])) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[86](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(959:4) {#if icon !== false}",
    		ctx
    	});

    	return block;
    }

    // (971:6) {#each modulesPrependContent as [module, options] (module)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ self: /*self*/ ctx[42] }, /*options*/ ctx[110]];
    	var switch_value = /*module*/ ctx[109].default;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[1] & /*self, modulesPrependContent*/ 2064)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[1] & /*self*/ 2048 && { self: /*self*/ ctx[42] },
    					dirty[1] & /*modulesPrependContent*/ 16 && get_spread_object(/*options*/ ctx[110])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*module*/ ctx[109].default)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(971:6) {#each modulesPrependContent as [module, options] (module)}",
    		ctx
    	});

    	return block;
    }

    // (974:6) {#if title !== false}
    function create_if_block_3(ctx) {
    	let div;
    	let if_block = !/*_titleElement*/ ctx[26] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", `pnotify-title ${/*getStyle*/ ctx[21]('title')}`);
    			add_location(div, file$7, 974, 8, 27695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			/*div_binding_1*/ ctx[87](div);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*_titleElement*/ ctx[26]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding_1*/ ctx[87](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(974:6) {#if title !== false}",
    		ctx
    	});

    	return block;
    }

    // (979:10) {#if !_titleElement}
    function create_if_block_4(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*titleTrusted*/ ctx[6]) return create_if_block_5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(979:10) {#if !_titleElement}",
    		ctx
    	});

    	return block;
    }

    // (982:12) {:else}
    function create_else_block_1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*title*/ ctx[5]);
    			attr_dev(span, "class", "pnotify-pre-line");
    			add_location(span, file$7, 982, 14, 27931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 32) set_data_dev(t, /*title*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(982:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (980:12) {#if titleTrusted}
    function create_if_block_5(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*title*/ ctx[5], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 32) html_tag.p(/*title*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(980:12) {#if titleTrusted}",
    		ctx
    	});

    	return block;
    }

    // (988:6) {#if text !== false}
    function create_if_block$5(ctx) {
    	let div;
    	let div_class_value;
    	let if_block = !/*_textElement*/ ctx[25] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();

    			attr_dev(div, "class", div_class_value = `pnotify-text ${/*getStyle*/ ctx[21]('text')} ${/*_maxTextHeightStyle*/ ctx[39] === ''
			? ''
			: 'pnotify-text-with-max-height'}`);

    			attr_dev(div, "style", /*_maxTextHeightStyle*/ ctx[39]);
    			attr_dev(div, "role", "alert");
    			add_location(div, file$7, 988, 8, 28073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			/*div_binding_2*/ ctx[88](div);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*_textElement*/ ctx[25]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[1] & /*_maxTextHeightStyle*/ 256 && div_class_value !== (div_class_value = `pnotify-text ${/*getStyle*/ ctx[21]('text')} ${/*_maxTextHeightStyle*/ ctx[39] === ''
			? ''
			: 'pnotify-text-with-max-height'}`)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty[1] & /*_maxTextHeightStyle*/ 256) {
    				attr_dev(div, "style", /*_maxTextHeightStyle*/ ctx[39]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding_2*/ ctx[88](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(988:6) {#if text !== false}",
    		ctx
    	});

    	return block;
    }

    // (995:10) {#if !_textElement}
    function create_if_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*textTrusted*/ ctx[8]) return create_if_block_2;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(995:10) {#if !_textElement}",
    		ctx
    	});

    	return block;
    }

    // (998:12) {:else}
    function create_else_block$5(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*text*/ ctx[7]);
    			attr_dev(span, "class", "pnotify-pre-line");
    			add_location(span, file$7, 998, 14, 28432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*text*/ 128) set_data_dev(t, /*text*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(998:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (996:12) {#if textTrusted}
    function create_if_block_2(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*text*/ ctx[7], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*text*/ 128) html_tag.p(/*text*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(996:12) {#if textTrusted}",
    		ctx
    	});

    	return block;
    }

    // (1004:6) {#each modulesAppendContent as [module, options] (module)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ self: /*self*/ ctx[42] }, /*options*/ ctx[110]];
    	var switch_value = /*module*/ ctx[109].default;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[1] & /*self, modulesAppendContent*/ 2056)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[1] & /*self*/ 2048 && { self: /*self*/ ctx[42] },
    					dirty[1] & /*modulesAppendContent*/ 8 && get_spread_object(/*options*/ ctx[110])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*module*/ ctx[109].default)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(1004:6) {#each modulesAppendContent as [module, options] (module)}",
    		ctx
    	});

    	return block;
    }

    // (1008:4) {#each modulesAppendContainer as [module, options] (module)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ self: /*self*/ ctx[42] }, /*options*/ ctx[110]];
    	var switch_value = /*module*/ ctx[109].default;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[1] & /*self, modulesAppendContainer*/ 2052)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[1] & /*self*/ 2048 && { self: /*self*/ ctx[42] },
    					dirty[1] & /*modulesAppendContainer*/ 4 && get_spread_object(/*options*/ ctx[110])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*module*/ ctx[109].default)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(1008:4) {#each modulesAppendContainer as [module, options] (module)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div2;
    	let div1;
    	let each_blocks_3 = [];
    	let each0_lookup = new Map_1();
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let div0;
    	let each_blocks_2 = [];
    	let each1_lookup = new Map_1();
    	let t4;
    	let t5;
    	let t6;
    	let each_blocks_1 = [];
    	let each2_lookup = new Map_1();
    	let t7;
    	let each_blocks = [];
    	let each3_lookup = new Map_1();
    	let div1_class_value;
    	let div1_style_value;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*modulesPrependContainer*/ ctx[36];
    	validate_each_argument(each_value_3);
    	const get_key = ctx => /*module*/ ctx[109];
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_3[i] = create_each_block_3(key, child_ctx));
    	}

    	let if_block0 = /*closer*/ ctx[16] && !/*_nonBlock*/ ctx[38] && create_if_block_8(ctx);
    	let if_block1 = /*sticker*/ ctx[18] && !/*_nonBlock*/ ctx[38] && create_if_block_7(ctx);
    	let if_block2 = /*icon*/ ctx[13] !== false && create_if_block_6(ctx);
    	let each_value_2 = /*modulesPrependContent*/ ctx[35];
    	validate_each_argument(each_value_2);
    	const get_key_1 = ctx => /*module*/ ctx[109];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key_1);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
    	}

    	let if_block3 = /*title*/ ctx[5] !== false && create_if_block_3(ctx);
    	let if_block4 = /*text*/ ctx[7] !== false && create_if_block$5(ctx);
    	let each_value_1 = /*modulesAppendContent*/ ctx[34];
    	validate_each_argument(each_value_1);
    	const get_key_2 = ctx => /*module*/ ctx[109];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key_2);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key_2(child_ctx);
    		each2_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	let each_value = /*modulesAppendContainer*/ ctx[33];
    	validate_each_argument(each_value);
    	const get_key_3 = ctx => /*module*/ ctx[109];
    	validate_each_keys(ctx, each_value, get_each_context, get_key_3);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key_3(child_ctx);
    		each3_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", `pnotify-content ${/*getStyle*/ ctx[21]('content')}`);
    			add_location(div0, file$7, 966, 4, 27411);
    			attr_dev(div1, "class", div1_class_value = `pnotify-container ${/*getStyle*/ ctx[21]('container')} ${/*getStyle*/ ctx[21](/*type*/ ctx[4])} ${/*shadow*/ ctx[15] ? 'pnotify-shadow' : ''} ${/*_moduleClasses*/ ctx[30].container.join(' ')}`);
    			attr_dev(div1, "style", div1_style_value = `${/*_widthStyle*/ ctx[41]} ${/*_minHeightStyle*/ ctx[40]}`);
    			attr_dev(div1, "role", "alert");
    			add_location(div1, file$7, 924, 2, 25954);
    			attr_dev(div2, "data-pnotify", "");

    			attr_dev(div2, "class", div2_class_value = `pnotify ${!/*stack*/ ctx[0] || /*stack*/ ctx[0].positioned
			? 'pnotify-positioned'
			: ''} ${/*icon*/ ctx[13] !== false ? 'pnotify-with-icon' : ''} ${/*getStyle*/ ctx[21]('elem')} pnotify-mode-${/*mode*/ ctx[9]} ${/*addClass*/ ctx[10]} ${/*_animatingClass*/ ctx[27]} ${/*_moveClass*/ ctx[28]} ${/*_stackDirClass*/ ctx[37]} ${/*animation*/ ctx[2] === 'fade'
			? `pnotify-fade-${/*animateSpeed*/ ctx[14]}`
			: ''} ${/*_modal*/ ctx[24]
			? `pnotify-modal ${/*addModalClass*/ ctx[11]}`
			: /*addModelessClass*/ ctx[12]} ${/*_masking*/ ctx[31] ? 'pnotify-masking' : ''} ${/*_maskingIn*/ ctx[32] ? 'pnotify-masking-in' : ''} ${/*_moduleClasses*/ ctx[30].elem.join(' ')}`);

    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "role", "alertdialog");
    			add_location(div2, file$7, 912, 0, 25227);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(div0, t4);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t5);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t6);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[89](div0);
    			append_dev(div1, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			/*div1_binding*/ ctx[90](div1);
    			/*div2_binding*/ ctx[91](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[43].call(null, div2)),
    					listen_dev(div2, "mouseenter", /*handleInteraction*/ ctx[44], false, false, false),
    					listen_dev(div2, "mouseleave", /*handleLeaveInteraction*/ ctx[45], false, false, false),
    					listen_dev(div2, "focusin", /*handleInteraction*/ ctx[44], false, false, false),
    					listen_dev(div2, "focusout", /*handleLeaveInteraction*/ ctx[45], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*modulesPrependContainer, self*/ 2080) {
    				each_value_3 = /*modulesPrependContainer*/ ctx[36];
    				validate_each_argument(each_value_3);
    				group_outros();
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);
    				each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx, each_value_3, each0_lookup, div1, outro_and_destroy_block, create_each_block_3, t0, get_each_context_3);
    				check_outros();
    			}

    			if (/*closer*/ ctx[16] && !/*_nonBlock*/ ctx[38]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*sticker*/ ctx[18] && !/*_nonBlock*/ ctx[38]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*icon*/ ctx[13] !== false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_6(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[1] & /*modulesPrependContent, self*/ 2064) {
    				each_value_2 = /*modulesPrependContent*/ ctx[35];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key_1);
    				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx, each_value_2, each1_lookup, div0, outro_and_destroy_block, create_each_block_2, t4, get_each_context_2);
    				check_outros();
    			}

    			if (/*title*/ ctx[5] !== false) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					if_block3.m(div0, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*text*/ ctx[7] !== false) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$5(ctx);
    					if_block4.c();
    					if_block4.m(div0, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty[1] & /*modulesAppendContent, self*/ 2056) {
    				each_value_1 = /*modulesAppendContent*/ ctx[34];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key_2);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_2, 1, ctx, each_value_1, each2_lookup, div0, outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
    				check_outros();
    			}

    			if (dirty[1] & /*modulesAppendContainer, self*/ 2052) {
    				each_value = /*modulesAppendContainer*/ ctx[33];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key_3);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx, each_value, each3_lookup, div1, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*type, shadow, _moduleClasses*/ 1073774608 && div1_class_value !== (div1_class_value = `pnotify-container ${/*getStyle*/ ctx[21]('container')} ${/*getStyle*/ ctx[21](/*type*/ ctx[4])} ${/*shadow*/ ctx[15] ? 'pnotify-shadow' : ''} ${/*_moduleClasses*/ ctx[30].container.join(' ')}`)) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[1] & /*_widthStyle, _minHeightStyle*/ 1536 && div1_style_value !== (div1_style_value = `${/*_widthStyle*/ ctx[41]} ${/*_minHeightStyle*/ ctx[40]}`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (!current || dirty[0] & /*stack, icon, mode, addClass, _animatingClass, _moveClass, animation, animateSpeed, _modal, addModalClass, addModelessClass, _moduleClasses*/ 1493204485 | dirty[1] & /*_stackDirClass, _masking, _maskingIn*/ 67 && div2_class_value !== (div2_class_value = `pnotify ${!/*stack*/ ctx[0] || /*stack*/ ctx[0].positioned
			? 'pnotify-positioned'
			: ''} ${/*icon*/ ctx[13] !== false ? 'pnotify-with-icon' : ''} ${/*getStyle*/ ctx[21]('elem')} pnotify-mode-${/*mode*/ ctx[9]} ${/*addClass*/ ctx[10]} ${/*_animatingClass*/ ctx[27]} ${/*_moveClass*/ ctx[28]} ${/*_stackDirClass*/ ctx[37]} ${/*animation*/ ctx[2] === 'fade'
			? `pnotify-fade-${/*animateSpeed*/ ctx[14]}`
			: ''} ${/*_modal*/ ctx[24]
			? `pnotify-modal ${/*addModalClass*/ ctx[11]}`
			: /*addModelessClass*/ ctx[12]} ${/*_masking*/ ctx[31] ? 'pnotify-masking' : ''} ${/*_maskingIn*/ ctx[32] ? 'pnotify-masking-in' : ''} ${/*_moduleClasses*/ ctx[30].elem.join(' ')}`)) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].d();
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].d();
    			}

    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			/*div0_binding*/ ctx[89](null);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*div1_binding*/ ctx[90](null);
    			/*div2_binding*/ ctx[91](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const alert = options => component(getDefaultArgs(options));
    const notice = options => component(getDefaultArgs(options, 'notice'));
    const info = options => component(getDefaultArgs(options, 'info'));
    const success = options => component(getDefaultArgs(options, 'success'));
    const error = options => component(getDefaultArgs(options, 'error'));

    // Default arguments for the new notice helper functions.
    function getDefaultArgs(options, type) {
    	if (typeof options !== 'object') {
    		options = { text: options };
    	}

    	// Only assign the type if it was requested, so we don't overwrite
    	// options.type if it has something assigned.
    	if (type) {
    		options.type = type;
    	}

    	let target = document.body;

    	if ('stack' in options && options.stack && options.stack.context) {
    		target = options.stack.context;
    	}

    	return { target, props: options };
    }

    const defaultStack = new Stack({
    		dir1: 'down',
    		dir2: 'left',
    		firstpos1: 25,
    		firstpos2: 25,
    		spacing1: 36,
    		spacing2: 36,
    		push: 'bottom'
    	});

    const defaultModules = new Map();

    const defaults$1 = {
    	type: 'notice',
    	title: false,
    	titleTrusted: false,
    	text: false,
    	textTrusted: false,
    	styling: 'brighttheme',
    	icons: 'brighttheme',
    	mode: 'no-preference',
    	addClass: '',
    	addModalClass: '',
    	addModelessClass: '',
    	autoOpen: true,
    	width: '360px',
    	minHeight: '16px',
    	maxTextHeight: '200px',
    	icon: true,
    	animation: 'fade',
    	animateSpeed: 'normal',
    	shadow: true,
    	hide: true,
    	delay: 8000,
    	mouseReset: true,
    	closer: true,
    	closerHover: true,
    	sticker: true,
    	stickerHover: true,
    	labels: {
    		close: 'Close',
    		stick: 'Pin',
    		unstick: 'Unpin'
    	},
    	remove: true,
    	destroy: true,
    	stack: defaultStack,
    	modules: defaultModules
    };

    let posTimer;

    // These actions need to be done once the DOM is ready.
    function onDocumentLoaded() {
    	if (!defaultStack.context) {
    		defaultStack.context = document.body;
    	}

    	// Reposition the notices when the window resizes.
    	window.addEventListener('resize', () => {
    		// This timer is used for queueing the position event so it doesn't run
    		// repeatedly.
    		if (posTimer) {
    			clearTimeout(posTimer);
    		}

    		posTimer = setTimeout(
    			() => {
    				const event = new Event('pnotify:position');
    				document.body.dispatchEvent(event);
    				posTimer = null;
    			},
    			10
    		);
    	});
    }

    // Run the deferred actions once the DOM is ready.
    if (window && document.body) {
    	onDocumentLoaded();
    } else {
    	document.addEventListener('DOMContentLoaded', onDocumentLoaded);
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let _widthStyle;
    	let _minHeightStyle;
    	let _maxTextHeightStyle;
    	let _titleElement;
    	let _textElement;
    	let _nonBlock;
    	let _stackDirClass;
    	let modulesPrependContainer;
    	let modulesPrependContent;
    	let modulesAppendContent;
    	let modulesAppendContainer;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Core', slots, []);
    	const self = get_current_component();
    	const dispatch = createEventDispatcher();

    	const forwardEvents = forwardEventsBuilder(self, [
    		'pnotify:init',
    		'pnotify:mount',
    		'pnotify:update',
    		'pnotify:beforeOpen',
    		'pnotify:afterOpen',
    		'pnotify:enterModal',
    		'pnotify:leaveModal',
    		'pnotify:beforeClose',
    		'pnotify:afterClose',
    		'pnotify:beforeDestroy',
    		'pnotify:afterDestroy',
    		'focusin',
    		'focusout',
    		'animationend',
    		'transitionend'
    	]);

    	let { modules = new Map(defaults$1.modules) } = $$props;
    	let { stack = defaults$1.stack } = $$props;

    	const refs = {
    		elem: null,
    		container: null,
    		content: null,
    		iconContainer: null,
    		titleContainer: null,
    		textContainer: null
    	};

    	// Run init to give a chance for modules to override defaults.
    	const selfDefaults = { ...defaults$1 };

    	dispatchLifecycleEvent('init', { notice: self, defaults: selfDefaults });
    	let { type = selfDefaults.type } = $$props;
    	let { title = selfDefaults.title } = $$props;
    	let { titleTrusted = selfDefaults.titleTrusted } = $$props;
    	let { text = selfDefaults.text } = $$props;
    	let { textTrusted = selfDefaults.textTrusted } = $$props;
    	let { styling = selfDefaults.styling } = $$props;
    	let { icons = selfDefaults.icons } = $$props;
    	let { mode = selfDefaults.mode } = $$props;
    	let { addClass = selfDefaults.addClass } = $$props;
    	let { addModalClass = selfDefaults.addModalClass } = $$props;
    	let { addModelessClass = selfDefaults.addModelessClass } = $$props;
    	let { autoOpen = selfDefaults.autoOpen } = $$props;
    	let { width = selfDefaults.width } = $$props;
    	let { minHeight = selfDefaults.minHeight } = $$props;
    	let { maxTextHeight = selfDefaults.maxTextHeight } = $$props;
    	let { icon = selfDefaults.icon } = $$props;
    	let { animation = selfDefaults.animation } = $$props;
    	let { animateSpeed = selfDefaults.animateSpeed } = $$props;
    	let { shadow = selfDefaults.shadow } = $$props;
    	let { hide = selfDefaults.hide } = $$props;
    	let { delay = selfDefaults.delay } = $$props;
    	let { mouseReset = selfDefaults.mouseReset } = $$props;
    	let { closer = selfDefaults.closer } = $$props;
    	let { closerHover = selfDefaults.closerHover } = $$props;
    	let { sticker = selfDefaults.sticker } = $$props;
    	let { stickerHover = selfDefaults.stickerHover } = $$props;
    	let { labels = selfDefaults.labels } = $$props;
    	let { remove = selfDefaults.remove } = $$props;
    	let { destroy = selfDefaults.destroy } = $$props;

    	// The state can be 'waiting', 'opening', 'open', 'closing', or 'closed'.
    	let _state = 'closed';

    	// Auto close timer.
    	let _timer = null;

    	// Animation timers.
    	let _animInTimer = null;

    	let _animOutTimer = null;

    	// Stores what is currently being animated (in or out).
    	let _animating = false;

    	// Stores the class that adds entry/exit animation effects.
    	let _animatingClass = '';

    	// Stores the class that adds movement animation effects.
    	let _moveClass = '';

    	// Stores whether the notice was hidden by a timer.
    	let _timerHide = false;

    	// Whether the mouse is over the notice or the notice is focused.
    	let _interacting = false;

    	// Holds classes that modules add for the notice element or container element.
    	let _moduleClasses = { elem: [], container: [] };

    	// Modules that change how the notice displays (causing the notice element to
    	// not appear) can set these to true to make PNotify handle it correctly.
    	let _moduleHandled = false;

    	let _moduleOpen = false;

    	// The masking control for the second notice in a modalish stack when the
    	// first notice is hovered.
    	let _masking = false;

    	let _maskingIn = false;
    	let _maskingTimer = null;

    	// Save the old value of hide, so we can reset the timer if it changes.
    	let _oldHide = hide;

    	// Promise that resolves when the notice has opened.
    	let _openPromise = null;

    	// Promise that resolved when the notice closes.
    	let _closePromise = null;

    	const getState = () => _state;
    	const getTimer = () => _timer;

    	const getStyle = name => typeof styling === 'string'
    	? `${styling}-${name}`
    	: name in styling
    		? styling[name]
    		: `${styling.prefix}-${name}`;

    	const getIcon = name => typeof icons === 'string'
    	? `${icons}-icon-${name}`
    	: name in icons
    		? icons[name]
    		: `${icons.prefix}-icon-${name}`;

    	// Whether the notification is in a modal stack (or a modalish stack in modal
    	// state).
    	let _modal = stack && (stack.modal === true || stack.modal === 'ish' && _timer === 'prevented');

    	let _oldStack = NaN;
    	let _stackBeforeAddOverlayOff = null;
    	let _stackAfterRemoveOverlayOff = null;

    	onMount(() => {
    		dispatchLifecycleEvent('mount');

    		// Display the notice.
    		if (autoOpen) {
    			open().catch(() => {
    				
    			});
    		}
    	});

    	beforeUpdate(() => {
    		dispatchLifecycleEvent('update');

    		// Update the timed hiding.
    		if (_state !== 'closed' && _state !== 'waiting' && hide !== _oldHide) {
    			if (!hide) {
    				cancelClose();
    			} else if (!_oldHide) {
    				queueClose();
    			}
    		}

    		// Queue a position
    		if (_state !== 'closed' && _state !== 'closing' && stack && !stack._collapsingModalState) {
    			stack.queuePosition();
    		}

    		// Save old options.
    		_oldHide = hide;
    	});

    	function handleInteraction(e) {
    		$$invalidate(29, _interacting = true);

    		// Stop animation, reset the removal timer when the user interacts.
    		if (mouseReset && _state === 'closing') {
    			if (!_timerHide) {
    				return;
    			}

    			cancelClose();
    		}

    		// Stop the close timer.
    		if (hide && mouseReset) {
    			cancelClose();
    		}
    	}

    	function handleLeaveInteraction(e) {
    		$$invalidate(29, _interacting = false);

    		// Start the close timer.
    		if (hide && mouseReset && _animating !== 'out' && ['open', 'opening'].indexOf(_state) !== -1) {
    			queueClose();
    		}
    	}

    	// This runs an event on all the modules.
    	function dispatchLifecycleEvent(event, detail = {}) {
    		const eventDetail = { notice: self, ...detail };

    		if (event === 'init') {
    			Array.from(modules).forEach(([module, options]) => 'init' in module && module.init(eventDetail));
    		}

    		let target = refs.elem || stack && stack.context || document.body;

    		if (!target) {
    			dispatch(`pnotify:${event}`, eventDetail);
    			return true;
    		}

    		const eventObj = new Event(`pnotify:${event}`,
    		{
    				bubbles: event === 'init' || event === 'mount',
    				cancelable: event.startsWith('before')
    			});

    		eventObj.detail = eventDetail;
    		target.dispatchEvent(eventObj);
    		return !eventObj.defaultPrevented;
    	}

    	function insertIntoDOM() {
    		// If the notice is not in the DOM, or in the wrong context, append it.
    		const target = stack && stack.context || document.body;

    		if (!target) {
    			throw new Error('No context to insert this notice into.');
    		}

    		if (!refs.elem) {
    			throw new Error('Trying to insert notice before element is available.');
    		}

    		if (refs.elem.parentNode !== target) {
    			target.appendChild(refs.elem);
    		}
    	}

    	function removeFromDOM() {
    		refs.elem && refs.elem.parentNode.removeChild(refs.elem);
    	}

    	let { open = immediate => {
    		if (_state === 'opening') {
    			return _openPromise;
    		}

    		if (_state === 'open') {
    			if (hide) {
    				queueClose();
    			}

    			return Promise.resolve();
    		}

    		if (!_moduleHandled && stack && stack._shouldNoticeWait(self)) {
    			_state = 'waiting';
    			return Promise.reject();
    		}

    		if (!dispatchLifecycleEvent('beforeOpen', { immediate })) {
    			return Promise.reject();
    		}

    		_state = 'opening';
    		$$invalidate(31, _masking = false);

    		// This makes the notice visibity: hidden; so its dimensions can be
    		// determined.
    		$$invalidate(27, _animatingClass = 'pnotify-initial pnotify-hidden');

    		let resolve;
    		let reject;

    		const promise = new Promise((res, rej) => {
    				resolve = res;
    				reject = rej;
    			});

    		_openPromise = promise;

    		const afterOpenCallback = () => {
    			// Now set it to hide.
    			if (hide) {
    				queueClose();
    			}

    			_state = 'open';
    			dispatchLifecycleEvent('afterOpen', { immediate });
    			_openPromise = null;
    			resolve();
    		};

    		if (_moduleOpen) {
    			afterOpenCallback();
    			return Promise.resolve();
    		}

    		insertIntoDOM();

    		// Wait until the DOM is updated.
    		window.requestAnimationFrame(() => {
    			if (_state !== 'opening') {
    				reject();
    				_openPromise = null;
    				return;
    			}

    			if (stack) {
    				// Mark the stack so it won't animate the new notice.
    				$$invalidate(0, stack._animation = false, stack);

    				if (stack.push === 'top') {
    					// Reset the position data so the notice is positioned as the first
    					// notice.
    					stack._resetPositionData();
    				}

    				// Now position the stack's the notices.
    				stack._positionNotice(self);

    				stack.queuePosition(0);

    				// Reset animation.
    				$$invalidate(0, stack._animation = true, stack);
    			}

    			animateIn(afterOpenCallback, immediate);
    		});

    		return promise;
    	} } = $$props;

    	let { close = (immediate, timerHide, waitAfterward) => {
    		if (_state === 'closing') {
    			return _closePromise;
    		}

    		if (_state === 'closed') {
    			return Promise.resolve();
    		}

    		const runDestroy = () => {
    			if (!dispatchLifecycleEvent('beforeDestroy')) {
    				return;
    			}

    			if (stack) {
    				stack._removeNotice(self);
    			}

    			self.$destroy();
    			dispatchLifecycleEvent('afterDestroy');
    		};

    		if (_state === 'waiting') {
    			if (waitAfterward) {
    				return Promise.resolve();
    			}

    			_state = 'closed';

    			// It's debatable whether the notice should be destroyed in this case, but
    			// I'm going to go ahead and say yes.
    			if (destroy && !waitAfterward) {
    				runDestroy();
    			}

    			return Promise.resolve();
    		}

    		if (!dispatchLifecycleEvent('beforeClose', { immediate, timerHide, waitAfterward })) {
    			return Promise.reject();
    		}

    		_state = 'closing';
    		_timerHide = !!timerHide; // Make sure it's a boolean.

    		if (_timer && _timer !== 'prevented' && clearTimeout) {
    			clearTimeout(_timer);
    		}

    		_timer = null;
    		let resolve;

    		const promise = new Promise((res, rej) => {
    				resolve = res;
    			});

    		_closePromise = promise;

    		animateOut(
    			() => {
    				$$invalidate(29, _interacting = false);
    				_timerHide = false;
    				_state = waitAfterward ? 'waiting' : 'closed';
    				dispatchLifecycleEvent('afterClose', { immediate, timerHide, waitAfterward });
    				_closePromise = null;
    				resolve();

    				if (!waitAfterward) {
    					if (destroy) {
    						// If we're supposed to destroy the notice, run the destroy module
    						// events, remove from stack, and let Svelte handle DOM removal.
    						runDestroy();
    					} else if (remove) {
    						// If we're supposed to remove the notice from the DOM, do it.
    						removeFromDOM();
    					}
    				}
    			},
    			immediate
    		);

    		return promise;
    	} } = $$props;

    	let { animateIn = (callback, immediate) => {
    		// Declare that the notice is animating in.
    		_animating = 'in';

    		const finished = event => {
    			if (event && refs.elem && event.target !== refs.elem) {
    				return;
    			}

    			refs.elem && refs.elem.removeEventListener('transitionend', finished);

    			if (_animInTimer) {
    				clearTimeout(_animInTimer);
    			}

    			if (_animating !== 'in') {
    				return;
    			}

    			let visible = _moduleOpen;

    			if (!visible && refs.elem) {
    				const domRect = refs.elem.getBoundingClientRect();

    				for (let prop in domRect) {
    					if (domRect[prop] > 0) {
    						visible = true;
    						break;
    					}
    				}
    			}

    			if (visible) {
    				if (callback) {
    					callback.call();
    				}

    				// Declare that the notice has completed animating.
    				_animating = false;
    			} else {
    				_animInTimer = setTimeout(finished, 40);
    			}
    		};

    		if (animation === 'fade' && !immediate) {
    			refs.elem && refs.elem.addEventListener('transitionend', finished);
    			$$invalidate(27, _animatingClass = 'pnotify-in');

    			tick().then(() => {
    				$$invalidate(27, _animatingClass = 'pnotify-in pnotify-fade-in');

    				// Just in case the event doesn't fire, call it after 650 ms.
    				_animInTimer = setTimeout(finished, 650);
    			});
    		} else {
    			const _animation = animation;
    			$$invalidate(2, animation = 'none');
    			$$invalidate(27, _animatingClass = `pnotify-in ${_animation === 'fade' ? 'pnotify-fade-in' : ''}`);

    			tick().then(() => {
    				$$invalidate(2, animation = _animation);
    				finished();
    			});
    		}
    	} } = $$props;

    	let { animateOut = (callback, immediate) => {
    		// Declare that the notice is animating out.
    		_animating = 'out';

    		const finished = event => {
    			if (event && refs.elem && event.target !== refs.elem) {
    				return;
    			}

    			refs.elem && refs.elem.removeEventListener('transitionend', finished);

    			if (_animOutTimer) {
    				clearTimeout(_animOutTimer);
    			}

    			if (_animating !== 'out') {
    				return;
    			}

    			let visible = _moduleOpen;

    			if (!visible && refs.elem) {
    				const domRect = refs.elem.getBoundingClientRect();

    				for (let prop in domRect) {
    					if (domRect[prop] > 0) {
    						visible = true;
    						break;
    					}
    				}
    			}

    			if (!refs.elem || !refs.elem.style.opacity || refs.elem.style.opacity === '0' || !visible) {
    				$$invalidate(27, _animatingClass = '');

    				if (callback) {
    					callback.call();
    				}

    				// Declare that the notice has completed animating.
    				_animating = false;
    			} else {
    				// In case this was called before the notice finished animating.
    				_animOutTimer = setTimeout(finished, 40);
    			}
    		};

    		if (animation === 'fade' && !immediate) {
    			refs.elem && refs.elem.addEventListener('transitionend', finished);
    			$$invalidate(27, _animatingClass = 'pnotify-in');

    			// Just in case the event doesn't fire, call it after 650 ms.
    			_animOutTimer = setTimeout(finished, 650);
    		} else {
    			$$invalidate(27, _animatingClass = '');

    			tick().then(() => {
    				finished();
    			});
    		}
    	} } = $$props;

    	function cancelClose() {
    		if (_timer && _timer !== 'prevented') {
    			clearTimeout(_timer);
    			_timer = null;
    		}

    		if (_animOutTimer) {
    			clearTimeout(_animOutTimer);
    		}

    		if (_state === 'closing') {
    			// If it's animating out, stop it.
    			_state = 'open';

    			_animating = false;

    			$$invalidate(27, _animatingClass = animation === 'fade'
    			? 'pnotify-in pnotify-fade-in'
    			: 'pnotify-in');
    		}
    	}

    	function queueClose() {
    		if (_timer === 'prevented') {
    			return;
    		}

    		// Cancel any current close timer.
    		cancelClose();

    		if (delay !== Infinity) {
    			_timer = setTimeout(() => close(false, true), isNaN(delay) ? 0 : delay);
    		}
    	}

    	function _preventTimerClose(prevent) {
    		if (prevent) {
    			cancelClose();
    			_timer = 'prevented';
    		} else if (_timer === 'prevented') {
    			_timer = null;

    			if (_state === 'open' && hide) {
    				queueClose();
    			}
    		}
    	}

    	function on(...args) {
    		return self.$on(...args);
    	}

    	function update(...args) {
    		return self.$set(...args);
    	}

    	function fire(name, detail) {
    		dispatch(name, detail);
    	}

    	function addModuleClass(element, ...classNames) {
    		for (let i = 0; i < classNames.length; i++) {
    			let className = classNames[i];

    			if (_moduleClasses[element].indexOf(className) === -1) {
    				_moduleClasses[element].push(className);
    			}
    		}

    		$$invalidate(30, _moduleClasses);
    	}

    	function removeModuleClass(element, ...classNames) {
    		for (let i = 0; i < classNames.length; i++) {
    			let className = classNames[i];
    			const idx = _moduleClasses[element].indexOf(className);

    			if (idx !== -1) {
    				_moduleClasses[element].splice(idx, 1);
    			}
    		}

    		$$invalidate(30, _moduleClasses);
    	}

    	function hasModuleClass(element, ...classNames) {
    		for (let i = 0; i < classNames.length; i++) {
    			let className = classNames[i];

    			if (_moduleClasses[element].indexOf(className) === -1) {
    				return false;
    			}
    		}

    		return true;
    	}

    	function getModuleHandled() {
    		return _moduleHandled;
    	}

    	function setModuleHandled(value) {
    		return _moduleHandled = value;
    	}

    	function getModuleOpen() {
    		return _moduleOpen;
    	}

    	function setModuleOpen(value) {
    		return _moduleOpen = value;
    	}

    	function setAnimating(value) {
    		return _animating = value;
    	}

    	function getAnimatingClass() {
    		return _animatingClass;
    	}

    	function setAnimatingClass(value) {
    		return $$invalidate(27, _animatingClass = value);
    	}

    	function _getMoveClass() {
    		return _moveClass;
    	}

    	function _setMoveClass(value) {
    		return $$invalidate(28, _moveClass = value);
    	}

    	function _setMasking(value, immediate, callback) {
    		if (_maskingTimer) {
    			clearTimeout(_maskingTimer);
    		}

    		if (_masking === value) {
    			return;
    		}

    		if (value) {
    			$$invalidate(31, _masking = true);
    			$$invalidate(32, _maskingIn = !!immediate);
    			insertIntoDOM();

    			tick().then(() => {
    				window.requestAnimationFrame(() => {
    					if (_masking) {
    						if (immediate && callback) {
    							callback();
    						} else {
    							$$invalidate(32, _maskingIn = true);

    							const finished = () => {
    								refs.elem && refs.elem.removeEventListener('transitionend', finished);

    								if (_maskingTimer) {
    									clearTimeout(_maskingTimer);
    								}

    								if (_maskingIn && callback) {
    									callback();
    								}
    							};

    							refs.elem && refs.elem.addEventListener('transitionend', finished);
    							_maskingTimer = setTimeout(finished, 650);
    						}
    					}
    				});
    			});
    		} else if (immediate) {
    			$$invalidate(31, _masking = false);
    			$$invalidate(32, _maskingIn = false);

    			if (remove && ['open', 'opening', 'closing'].indexOf(_state) === -1) {
    				removeFromDOM();
    			}

    			if (callback) {
    				callback();
    			}
    		} else {
    			const finished = () => {
    				refs.elem && refs.elem.removeEventListener('transitionend', finished);

    				if (_maskingTimer) {
    					clearTimeout(_maskingTimer);
    				}

    				if (!_maskingIn) {
    					$$invalidate(31, _masking = false);

    					if (remove && ['open', 'opening', 'closing'].indexOf(_state) === -1) {
    						removeFromDOM();
    					}

    					if (callback) {
    						callback();
    					}
    				}
    			};

    			$$invalidate(32, _maskingIn = false);
    			refs.elem && refs.elem.addEventListener('transitionend', finished);
    			refs.elem && refs.elem.style.opacity; // This line is necessary for some reason. Some notices don't fade without it.

    			// Just in case the event doesn't fire, call it after 650 ms.
    			_maskingTimer = setTimeout(finished, 650);
    		}
    	}

    	const writable_props = [
    		'modules',
    		'stack',
    		'type',
    		'title',
    		'titleTrusted',
    		'text',
    		'textTrusted',
    		'styling',
    		'icons',
    		'mode',
    		'addClass',
    		'addModalClass',
    		'addModelessClass',
    		'autoOpen',
    		'width',
    		'minHeight',
    		'maxTextHeight',
    		'icon',
    		'animation',
    		'animateSpeed',
    		'shadow',
    		'hide',
    		'delay',
    		'mouseReset',
    		'closer',
    		'closerHover',
    		'sticker',
    		'stickerHover',
    		'labels',
    		'remove',
    		'destroy',
    		'open',
    		'close',
    		'animateIn',
    		'animateOut'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Core> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => close(false);
    	const click_handler_1 = () => $$invalidate(3, hide = !hide);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.iconContainer = $$value;
    			$$invalidate(1, refs);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.titleContainer = $$value;
    			$$invalidate(1, refs);
    		});
    	}

    	function div_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.textContainer = $$value;
    			$$invalidate(1, refs);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.content = $$value;
    			$$invalidate(1, refs);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.container = $$value;
    			$$invalidate(1, refs);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.elem = $$value;
    			$$invalidate(1, refs);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('modules' in $$props) $$invalidate(46, modules = $$props.modules);
    		if ('stack' in $$props) $$invalidate(0, stack = $$props.stack);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('title' in $$props) $$invalidate(5, title = $$props.title);
    		if ('titleTrusted' in $$props) $$invalidate(6, titleTrusted = $$props.titleTrusted);
    		if ('text' in $$props) $$invalidate(7, text = $$props.text);
    		if ('textTrusted' in $$props) $$invalidate(8, textTrusted = $$props.textTrusted);
    		if ('styling' in $$props) $$invalidate(47, styling = $$props.styling);
    		if ('icons' in $$props) $$invalidate(48, icons = $$props.icons);
    		if ('mode' in $$props) $$invalidate(9, mode = $$props.mode);
    		if ('addClass' in $$props) $$invalidate(10, addClass = $$props.addClass);
    		if ('addModalClass' in $$props) $$invalidate(11, addModalClass = $$props.addModalClass);
    		if ('addModelessClass' in $$props) $$invalidate(12, addModelessClass = $$props.addModelessClass);
    		if ('autoOpen' in $$props) $$invalidate(49, autoOpen = $$props.autoOpen);
    		if ('width' in $$props) $$invalidate(50, width = $$props.width);
    		if ('minHeight' in $$props) $$invalidate(51, minHeight = $$props.minHeight);
    		if ('maxTextHeight' in $$props) $$invalidate(52, maxTextHeight = $$props.maxTextHeight);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('animation' in $$props) $$invalidate(2, animation = $$props.animation);
    		if ('animateSpeed' in $$props) $$invalidate(14, animateSpeed = $$props.animateSpeed);
    		if ('shadow' in $$props) $$invalidate(15, shadow = $$props.shadow);
    		if ('hide' in $$props) $$invalidate(3, hide = $$props.hide);
    		if ('delay' in $$props) $$invalidate(53, delay = $$props.delay);
    		if ('mouseReset' in $$props) $$invalidate(54, mouseReset = $$props.mouseReset);
    		if ('closer' in $$props) $$invalidate(16, closer = $$props.closer);
    		if ('closerHover' in $$props) $$invalidate(17, closerHover = $$props.closerHover);
    		if ('sticker' in $$props) $$invalidate(18, sticker = $$props.sticker);
    		if ('stickerHover' in $$props) $$invalidate(19, stickerHover = $$props.stickerHover);
    		if ('labels' in $$props) $$invalidate(20, labels = $$props.labels);
    		if ('remove' in $$props) $$invalidate(55, remove = $$props.remove);
    		if ('destroy' in $$props) $$invalidate(56, destroy = $$props.destroy);
    		if ('open' in $$props) $$invalidate(59, open = $$props.open);
    		if ('close' in $$props) $$invalidate(23, close = $$props.close);
    		if ('animateIn' in $$props) $$invalidate(60, animateIn = $$props.animateIn);
    		if ('animateOut' in $$props) $$invalidate(61, animateOut = $$props.animateOut);
    	};

    	$$self.$capture_state = () => ({
    		component,
    		Stack,
    		alert,
    		notice,
    		info,
    		success,
    		error,
    		getDefaultArgs,
    		defaultStack,
    		defaultModules,
    		defaults: defaults$1,
    		posTimer,
    		onDocumentLoaded,
    		onMount,
    		beforeUpdate,
    		tick,
    		createEventDispatcher,
    		get_current_component,
    		forwardEventsBuilder,
    		self,
    		dispatch,
    		forwardEvents,
    		modules,
    		stack,
    		refs,
    		selfDefaults,
    		type,
    		title,
    		titleTrusted,
    		text,
    		textTrusted,
    		styling,
    		icons,
    		mode,
    		addClass,
    		addModalClass,
    		addModelessClass,
    		autoOpen,
    		width,
    		minHeight,
    		maxTextHeight,
    		icon,
    		animation,
    		animateSpeed,
    		shadow,
    		hide,
    		delay,
    		mouseReset,
    		closer,
    		closerHover,
    		sticker,
    		stickerHover,
    		labels,
    		remove,
    		destroy,
    		_state,
    		_timer,
    		_animInTimer,
    		_animOutTimer,
    		_animating,
    		_animatingClass,
    		_moveClass,
    		_timerHide,
    		_interacting,
    		_moduleClasses,
    		_moduleHandled,
    		_moduleOpen,
    		_masking,
    		_maskingIn,
    		_maskingTimer,
    		_oldHide,
    		_openPromise,
    		_closePromise,
    		getState,
    		getTimer,
    		getStyle,
    		getIcon,
    		_modal,
    		_oldStack,
    		_stackBeforeAddOverlayOff,
    		_stackAfterRemoveOverlayOff,
    		handleInteraction,
    		handleLeaveInteraction,
    		dispatchLifecycleEvent,
    		insertIntoDOM,
    		removeFromDOM,
    		open,
    		close,
    		animateIn,
    		animateOut,
    		cancelClose,
    		queueClose,
    		_preventTimerClose,
    		on,
    		update,
    		fire,
    		addModuleClass,
    		removeModuleClass,
    		hasModuleClass,
    		getModuleHandled,
    		setModuleHandled,
    		getModuleOpen,
    		setModuleOpen,
    		setAnimating,
    		getAnimatingClass,
    		setAnimatingClass,
    		_getMoveClass,
    		_setMoveClass,
    		_setMasking,
    		_textElement,
    		_titleElement,
    		modulesAppendContainer,
    		modulesAppendContent,
    		modulesPrependContent,
    		modulesPrependContainer,
    		_stackDirClass,
    		_nonBlock,
    		_maxTextHeightStyle,
    		_minHeightStyle,
    		_widthStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('modules' in $$props) $$invalidate(46, modules = $$props.modules);
    		if ('stack' in $$props) $$invalidate(0, stack = $$props.stack);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('title' in $$props) $$invalidate(5, title = $$props.title);
    		if ('titleTrusted' in $$props) $$invalidate(6, titleTrusted = $$props.titleTrusted);
    		if ('text' in $$props) $$invalidate(7, text = $$props.text);
    		if ('textTrusted' in $$props) $$invalidate(8, textTrusted = $$props.textTrusted);
    		if ('styling' in $$props) $$invalidate(47, styling = $$props.styling);
    		if ('icons' in $$props) $$invalidate(48, icons = $$props.icons);
    		if ('mode' in $$props) $$invalidate(9, mode = $$props.mode);
    		if ('addClass' in $$props) $$invalidate(10, addClass = $$props.addClass);
    		if ('addModalClass' in $$props) $$invalidate(11, addModalClass = $$props.addModalClass);
    		if ('addModelessClass' in $$props) $$invalidate(12, addModelessClass = $$props.addModelessClass);
    		if ('autoOpen' in $$props) $$invalidate(49, autoOpen = $$props.autoOpen);
    		if ('width' in $$props) $$invalidate(50, width = $$props.width);
    		if ('minHeight' in $$props) $$invalidate(51, minHeight = $$props.minHeight);
    		if ('maxTextHeight' in $$props) $$invalidate(52, maxTextHeight = $$props.maxTextHeight);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('animation' in $$props) $$invalidate(2, animation = $$props.animation);
    		if ('animateSpeed' in $$props) $$invalidate(14, animateSpeed = $$props.animateSpeed);
    		if ('shadow' in $$props) $$invalidate(15, shadow = $$props.shadow);
    		if ('hide' in $$props) $$invalidate(3, hide = $$props.hide);
    		if ('delay' in $$props) $$invalidate(53, delay = $$props.delay);
    		if ('mouseReset' in $$props) $$invalidate(54, mouseReset = $$props.mouseReset);
    		if ('closer' in $$props) $$invalidate(16, closer = $$props.closer);
    		if ('closerHover' in $$props) $$invalidate(17, closerHover = $$props.closerHover);
    		if ('sticker' in $$props) $$invalidate(18, sticker = $$props.sticker);
    		if ('stickerHover' in $$props) $$invalidate(19, stickerHover = $$props.stickerHover);
    		if ('labels' in $$props) $$invalidate(20, labels = $$props.labels);
    		if ('remove' in $$props) $$invalidate(55, remove = $$props.remove);
    		if ('destroy' in $$props) $$invalidate(56, destroy = $$props.destroy);
    		if ('_state' in $$props) _state = $$props._state;
    		if ('_timer' in $$props) _timer = $$props._timer;
    		if ('_animInTimer' in $$props) _animInTimer = $$props._animInTimer;
    		if ('_animOutTimer' in $$props) _animOutTimer = $$props._animOutTimer;
    		if ('_animating' in $$props) _animating = $$props._animating;
    		if ('_animatingClass' in $$props) $$invalidate(27, _animatingClass = $$props._animatingClass);
    		if ('_moveClass' in $$props) $$invalidate(28, _moveClass = $$props._moveClass);
    		if ('_timerHide' in $$props) _timerHide = $$props._timerHide;
    		if ('_interacting' in $$props) $$invalidate(29, _interacting = $$props._interacting);
    		if ('_moduleClasses' in $$props) $$invalidate(30, _moduleClasses = $$props._moduleClasses);
    		if ('_moduleHandled' in $$props) _moduleHandled = $$props._moduleHandled;
    		if ('_moduleOpen' in $$props) _moduleOpen = $$props._moduleOpen;
    		if ('_masking' in $$props) $$invalidate(31, _masking = $$props._masking);
    		if ('_maskingIn' in $$props) $$invalidate(32, _maskingIn = $$props._maskingIn);
    		if ('_maskingTimer' in $$props) _maskingTimer = $$props._maskingTimer;
    		if ('_oldHide' in $$props) _oldHide = $$props._oldHide;
    		if ('_openPromise' in $$props) _openPromise = $$props._openPromise;
    		if ('_closePromise' in $$props) _closePromise = $$props._closePromise;
    		if ('_modal' in $$props) $$invalidate(24, _modal = $$props._modal);
    		if ('_oldStack' in $$props) $$invalidate(81, _oldStack = $$props._oldStack);
    		if ('_stackBeforeAddOverlayOff' in $$props) $$invalidate(82, _stackBeforeAddOverlayOff = $$props._stackBeforeAddOverlayOff);
    		if ('_stackAfterRemoveOverlayOff' in $$props) $$invalidate(83, _stackAfterRemoveOverlayOff = $$props._stackAfterRemoveOverlayOff);
    		if ('open' in $$props) $$invalidate(59, open = $$props.open);
    		if ('close' in $$props) $$invalidate(23, close = $$props.close);
    		if ('animateIn' in $$props) $$invalidate(60, animateIn = $$props.animateIn);
    		if ('animateOut' in $$props) $$invalidate(61, animateOut = $$props.animateOut);
    		if ('_textElement' in $$props) $$invalidate(25, _textElement = $$props._textElement);
    		if ('_titleElement' in $$props) $$invalidate(26, _titleElement = $$props._titleElement);
    		if ('modulesAppendContainer' in $$props) $$invalidate(33, modulesAppendContainer = $$props.modulesAppendContainer);
    		if ('modulesAppendContent' in $$props) $$invalidate(34, modulesAppendContent = $$props.modulesAppendContent);
    		if ('modulesPrependContent' in $$props) $$invalidate(35, modulesPrependContent = $$props.modulesPrependContent);
    		if ('modulesPrependContainer' in $$props) $$invalidate(36, modulesPrependContainer = $$props.modulesPrependContainer);
    		if ('_stackDirClass' in $$props) $$invalidate(37, _stackDirClass = $$props._stackDirClass);
    		if ('_nonBlock' in $$props) $$invalidate(38, _nonBlock = $$props._nonBlock);
    		if ('_maxTextHeightStyle' in $$props) $$invalidate(39, _maxTextHeightStyle = $$props._maxTextHeightStyle);
    		if ('_minHeightStyle' in $$props) $$invalidate(40, _minHeightStyle = $$props._minHeightStyle);
    		if ('_widthStyle' in $$props) $$invalidate(41, _widthStyle = $$props._widthStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*width*/ 524288) {
    			// Grab the icons from the icons object or use provided icons
    			$$invalidate(41, _widthStyle = typeof width === 'string' ? `width: ${width};` : '');
    		}

    		if ($$self.$$.dirty[1] & /*minHeight*/ 1048576) {
    			$$invalidate(40, _minHeightStyle = typeof minHeight === 'string'
    			? `min-height: ${minHeight};`
    			: '');
    		}

    		if ($$self.$$.dirty[1] & /*maxTextHeight*/ 2097152) {
    			$$invalidate(39, _maxTextHeightStyle = typeof maxTextHeight === 'string'
    			? `max-height: ${maxTextHeight};`
    			: '');
    		}

    		if ($$self.$$.dirty[0] & /*title*/ 32) {
    			$$invalidate(26, _titleElement = title instanceof HTMLElement);
    		}

    		if ($$self.$$.dirty[0] & /*text*/ 128) {
    			$$invalidate(25, _textElement = text instanceof HTMLElement);
    		}

    		if ($$self.$$.dirty[0] & /*stack*/ 1 | $$self.$$.dirty[2] & /*_oldStack, _stackBeforeAddOverlayOff, _stackAfterRemoveOverlayOff*/ 3670016) {
    			if (_oldStack !== stack) {
    				if (_oldStack) {
    					// Remove the notice from the old stack.
    					_oldStack._removeNotice(self);

    					// Remove the listeners.
    					$$invalidate(24, _modal = false);

    					_stackBeforeAddOverlayOff();
    					_stackAfterRemoveOverlayOff();
    				}

    				if (stack) {
    					// Add the notice to the stack.
    					stack._addNotice(self);

    					// Add listeners for modal state.
    					$$invalidate(82, _stackBeforeAddOverlayOff = stack.on('beforeAddOverlay', () => {
    						$$invalidate(24, _modal = true);
    						dispatchLifecycleEvent('enterModal');
    					}));

    					$$invalidate(83, _stackAfterRemoveOverlayOff = stack.on('afterRemoveOverlay', () => {
    						$$invalidate(24, _modal = false);
    						dispatchLifecycleEvent('leaveModal');
    					}));
    				}

    				$$invalidate(81, _oldStack = stack);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*addClass, addModalClass, _modal, addModelessClass*/ 16784384) {
    			$$invalidate(38, _nonBlock = addClass.match(/\bnonblock\b/) || addModalClass.match(/\bnonblock\b/) && _modal || addModelessClass.match(/\bnonblock\b/) && !_modal);
    		}

    		if ($$self.$$.dirty[0] & /*stack*/ 1) {
    			// This is for specific styling for how notices stack.
    			$$invalidate(37, _stackDirClass = stack && stack.dir1 ? `pnotify-stack-${stack.dir1}` : '');
    		}

    		if ($$self.$$.dirty[1] & /*modules*/ 32768) {
    			// Filter through the module objects, getting an array for each position.
    			$$invalidate(36, modulesPrependContainer = Array.from(modules).filter(([module, options]) => module.position === 'PrependContainer'));
    		}

    		if ($$self.$$.dirty[1] & /*modules*/ 32768) {
    			$$invalidate(35, modulesPrependContent = Array.from(modules).filter(([module, options]) => module.position === 'PrependContent'));
    		}

    		if ($$self.$$.dirty[1] & /*modules*/ 32768) {
    			$$invalidate(34, modulesAppendContent = Array.from(modules).filter(([module, options]) => module.position === 'AppendContent'));
    		}

    		if ($$self.$$.dirty[1] & /*modules*/ 32768) {
    			$$invalidate(33, modulesAppendContainer = Array.from(modules).filter(([module, options]) => module.position === 'AppendContainer'));
    		}

    		if ($$self.$$.dirty[0] & /*_titleElement, refs, title*/ 67108898) {
    			if (_titleElement && refs.titleContainer) {
    				refs.titleContainer.appendChild(title);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*_textElement, refs, text*/ 33554562) {
    			if (_textElement && refs.textContainer) {
    				refs.textContainer.appendChild(text);
    			}
    		}
    	};

    	return [
    		stack,
    		refs,
    		animation,
    		hide,
    		type,
    		title,
    		titleTrusted,
    		text,
    		textTrusted,
    		mode,
    		addClass,
    		addModalClass,
    		addModelessClass,
    		icon,
    		animateSpeed,
    		shadow,
    		closer,
    		closerHover,
    		sticker,
    		stickerHover,
    		labels,
    		getStyle,
    		getIcon,
    		close,
    		_modal,
    		_textElement,
    		_titleElement,
    		_animatingClass,
    		_moveClass,
    		_interacting,
    		_moduleClasses,
    		_masking,
    		_maskingIn,
    		modulesAppendContainer,
    		modulesAppendContent,
    		modulesPrependContent,
    		modulesPrependContainer,
    		_stackDirClass,
    		_nonBlock,
    		_maxTextHeightStyle,
    		_minHeightStyle,
    		_widthStyle,
    		self,
    		forwardEvents,
    		handleInteraction,
    		handleLeaveInteraction,
    		modules,
    		styling,
    		icons,
    		autoOpen,
    		width,
    		minHeight,
    		maxTextHeight,
    		delay,
    		mouseReset,
    		remove,
    		destroy,
    		getState,
    		getTimer,
    		open,
    		animateIn,
    		animateOut,
    		cancelClose,
    		queueClose,
    		_preventTimerClose,
    		on,
    		update,
    		fire,
    		addModuleClass,
    		removeModuleClass,
    		hasModuleClass,
    		getModuleHandled,
    		setModuleHandled,
    		getModuleOpen,
    		setModuleOpen,
    		setAnimating,
    		getAnimatingClass,
    		setAnimatingClass,
    		_getMoveClass,
    		_setMoveClass,
    		_setMasking,
    		_oldStack,
    		_stackBeforeAddOverlayOff,
    		_stackAfterRemoveOverlayOff,
    		click_handler,
    		click_handler_1,
    		div_binding,
    		div_binding_1,
    		div_binding_2,
    		div0_binding,
    		div1_binding,
    		div2_binding
    	];
    }

    class Core extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				modules: 46,
    				stack: 0,
    				refs: 1,
    				type: 4,
    				title: 5,
    				titleTrusted: 6,
    				text: 7,
    				textTrusted: 8,
    				styling: 47,
    				icons: 48,
    				mode: 9,
    				addClass: 10,
    				addModalClass: 11,
    				addModelessClass: 12,
    				autoOpen: 49,
    				width: 50,
    				minHeight: 51,
    				maxTextHeight: 52,
    				icon: 13,
    				animation: 2,
    				animateSpeed: 14,
    				shadow: 15,
    				hide: 3,
    				delay: 53,
    				mouseReset: 54,
    				closer: 16,
    				closerHover: 17,
    				sticker: 18,
    				stickerHover: 19,
    				labels: 20,
    				remove: 55,
    				destroy: 56,
    				getState: 57,
    				getTimer: 58,
    				getStyle: 21,
    				getIcon: 22,
    				open: 59,
    				close: 23,
    				animateIn: 60,
    				animateOut: 61,
    				cancelClose: 62,
    				queueClose: 63,
    				_preventTimerClose: 64,
    				on: 65,
    				update: 66,
    				fire: 67,
    				addModuleClass: 68,
    				removeModuleClass: 69,
    				hasModuleClass: 70,
    				getModuleHandled: 71,
    				setModuleHandled: 72,
    				getModuleOpen: 73,
    				setModuleOpen: 74,
    				setAnimating: 75,
    				getAnimatingClass: 76,
    				setAnimatingClass: 77,
    				_getMoveClass: 78,
    				_setMoveClass: 79,
    				_setMasking: 80
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Core",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get modules() {
    		return this.$$.ctx[46];
    	}

    	set modules(modules) {
    		this.$$set({ modules });
    		flush();
    	}

    	get stack() {
    		return this.$$.ctx[0];
    	}

    	set stack(stack) {
    		this.$$set({ stack });
    		flush();
    	}

    	get refs() {
    		return this.$$.ctx[1];
    	}

    	set refs(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'refs'");
    	}

    	get type() {
    		return this.$$.ctx[4];
    	}

    	set type(type) {
    		this.$$set({ type });
    		flush();
    	}

    	get title() {
    		return this.$$.ctx[5];
    	}

    	set title(title) {
    		this.$$set({ title });
    		flush();
    	}

    	get titleTrusted() {
    		return this.$$.ctx[6];
    	}

    	set titleTrusted(titleTrusted) {
    		this.$$set({ titleTrusted });
    		flush();
    	}

    	get text() {
    		return this.$$.ctx[7];
    	}

    	set text(text) {
    		this.$$set({ text });
    		flush();
    	}

    	get textTrusted() {
    		return this.$$.ctx[8];
    	}

    	set textTrusted(textTrusted) {
    		this.$$set({ textTrusted });
    		flush();
    	}

    	get styling() {
    		return this.$$.ctx[47];
    	}

    	set styling(styling) {
    		this.$$set({ styling });
    		flush();
    	}

    	get icons() {
    		return this.$$.ctx[48];
    	}

    	set icons(icons) {
    		this.$$set({ icons });
    		flush();
    	}

    	get mode() {
    		return this.$$.ctx[9];
    	}

    	set mode(mode) {
    		this.$$set({ mode });
    		flush();
    	}

    	get addClass() {
    		return this.$$.ctx[10];
    	}

    	set addClass(addClass) {
    		this.$$set({ addClass });
    		flush();
    	}

    	get addModalClass() {
    		return this.$$.ctx[11];
    	}

    	set addModalClass(addModalClass) {
    		this.$$set({ addModalClass });
    		flush();
    	}

    	get addModelessClass() {
    		return this.$$.ctx[12];
    	}

    	set addModelessClass(addModelessClass) {
    		this.$$set({ addModelessClass });
    		flush();
    	}

    	get autoOpen() {
    		return this.$$.ctx[49];
    	}

    	set autoOpen(autoOpen) {
    		this.$$set({ autoOpen });
    		flush();
    	}

    	get width() {
    		return this.$$.ctx[50];
    	}

    	set width(width) {
    		this.$$set({ width });
    		flush();
    	}

    	get minHeight() {
    		return this.$$.ctx[51];
    	}

    	set minHeight(minHeight) {
    		this.$$set({ minHeight });
    		flush();
    	}

    	get maxTextHeight() {
    		return this.$$.ctx[52];
    	}

    	set maxTextHeight(maxTextHeight) {
    		this.$$set({ maxTextHeight });
    		flush();
    	}

    	get icon() {
    		return this.$$.ctx[13];
    	}

    	set icon(icon) {
    		this.$$set({ icon });
    		flush();
    	}

    	get animation() {
    		return this.$$.ctx[2];
    	}

    	set animation(animation) {
    		this.$$set({ animation });
    		flush();
    	}

    	get animateSpeed() {
    		return this.$$.ctx[14];
    	}

    	set animateSpeed(animateSpeed) {
    		this.$$set({ animateSpeed });
    		flush();
    	}

    	get shadow() {
    		return this.$$.ctx[15];
    	}

    	set shadow(shadow) {
    		this.$$set({ shadow });
    		flush();
    	}

    	get hide() {
    		return this.$$.ctx[3];
    	}

    	set hide(hide) {
    		this.$$set({ hide });
    		flush();
    	}

    	get delay() {
    		return this.$$.ctx[53];
    	}

    	set delay(delay) {
    		this.$$set({ delay });
    		flush();
    	}

    	get mouseReset() {
    		return this.$$.ctx[54];
    	}

    	set mouseReset(mouseReset) {
    		this.$$set({ mouseReset });
    		flush();
    	}

    	get closer() {
    		return this.$$.ctx[16];
    	}

    	set closer(closer) {
    		this.$$set({ closer });
    		flush();
    	}

    	get closerHover() {
    		return this.$$.ctx[17];
    	}

    	set closerHover(closerHover) {
    		this.$$set({ closerHover });
    		flush();
    	}

    	get sticker() {
    		return this.$$.ctx[18];
    	}

    	set sticker(sticker) {
    		this.$$set({ sticker });
    		flush();
    	}

    	get stickerHover() {
    		return this.$$.ctx[19];
    	}

    	set stickerHover(stickerHover) {
    		this.$$set({ stickerHover });
    		flush();
    	}

    	get labels() {
    		return this.$$.ctx[20];
    	}

    	set labels(labels) {
    		this.$$set({ labels });
    		flush();
    	}

    	get remove() {
    		return this.$$.ctx[55];
    	}

    	set remove(remove) {
    		this.$$set({ remove });
    		flush();
    	}

    	get destroy() {
    		return this.$$.ctx[56];
    	}

    	set destroy(destroy) {
    		this.$$set({ destroy });
    		flush();
    	}

    	get getState() {
    		return this.$$.ctx[57];
    	}

    	set getState(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getState'");
    	}

    	get getTimer() {
    		return this.$$.ctx[58];
    	}

    	set getTimer(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getTimer'");
    	}

    	get getStyle() {
    		return this.$$.ctx[21];
    	}

    	set getStyle(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getStyle'");
    	}

    	get getIcon() {
    		return this.$$.ctx[22];
    	}

    	set getIcon(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getIcon'");
    	}

    	get open() {
    		return this.$$.ctx[59];
    	}

    	set open(open) {
    		this.$$set({ open });
    		flush();
    	}

    	get close() {
    		return this.$$.ctx[23];
    	}

    	set close(close) {
    		this.$$set({ close });
    		flush();
    	}

    	get animateIn() {
    		return this.$$.ctx[60];
    	}

    	set animateIn(animateIn) {
    		this.$$set({ animateIn });
    		flush();
    	}

    	get animateOut() {
    		return this.$$.ctx[61];
    	}

    	set animateOut(animateOut) {
    		this.$$set({ animateOut });
    		flush();
    	}

    	get cancelClose() {
    		return this.$$.ctx[62];
    	}

    	set cancelClose(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'cancelClose'");
    	}

    	get queueClose() {
    		return this.$$.ctx[63];
    	}

    	set queueClose(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'queueClose'");
    	}

    	get _preventTimerClose() {
    		return this.$$.ctx[64];
    	}

    	set _preventTimerClose(value) {
    		throw new Error_1("<Core>: Cannot set read-only property '_preventTimerClose'");
    	}

    	get on() {
    		return this.$$.ctx[65];
    	}

    	set on(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'on'");
    	}

    	get update() {
    		return this.$$.ctx[66];
    	}

    	set update(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'update'");
    	}

    	get fire() {
    		return this.$$.ctx[67];
    	}

    	set fire(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'fire'");
    	}

    	get addModuleClass() {
    		return this.$$.ctx[68];
    	}

    	set addModuleClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'addModuleClass'");
    	}

    	get removeModuleClass() {
    		return this.$$.ctx[69];
    	}

    	set removeModuleClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'removeModuleClass'");
    	}

    	get hasModuleClass() {
    		return this.$$.ctx[70];
    	}

    	set hasModuleClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'hasModuleClass'");
    	}

    	get getModuleHandled() {
    		return this.$$.ctx[71];
    	}

    	set getModuleHandled(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getModuleHandled'");
    	}

    	get setModuleHandled() {
    		return this.$$.ctx[72];
    	}

    	set setModuleHandled(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'setModuleHandled'");
    	}

    	get getModuleOpen() {
    		return this.$$.ctx[73];
    	}

    	set getModuleOpen(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getModuleOpen'");
    	}

    	get setModuleOpen() {
    		return this.$$.ctx[74];
    	}

    	set setModuleOpen(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'setModuleOpen'");
    	}

    	get setAnimating() {
    		return this.$$.ctx[75];
    	}

    	set setAnimating(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'setAnimating'");
    	}

    	get getAnimatingClass() {
    		return this.$$.ctx[76];
    	}

    	set getAnimatingClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'getAnimatingClass'");
    	}

    	get setAnimatingClass() {
    		return this.$$.ctx[77];
    	}

    	set setAnimatingClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property 'setAnimatingClass'");
    	}

    	get _getMoveClass() {
    		return this.$$.ctx[78];
    	}

    	set _getMoveClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property '_getMoveClass'");
    	}

    	get _setMoveClass() {
    		return this.$$.ctx[79];
    	}

    	set _setMoveClass(value) {
    		throw new Error_1("<Core>: Cannot set read-only property '_setMoveClass'");
    	}

    	get _setMasking() {
    		return this.$$.ctx[80];
    	}

    	set _setMasking(value) {
    		throw new Error_1("<Core>: Cannot set read-only property '_setMasking'");
    	}
    }

    /* node_modules/@pnotify/mobile/index.svelte generated by Svelte v3.44.3 */

    const { window: window_1 } = globals;

    function create_fragment$7(ctx) {
    	let mounted;
    	let dispose;

    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*resize_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const position = 'PrependContainer';
    const defaults = { swipeDismiss: true };

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mobile', slots, []);
    	let { self = null } = $$props;
    	let { swipeDismiss = defaults.swipeDismiss } = $$props;
    	let origXY = null;
    	let diffXY = null;
    	let noticeWidthHeight = null;
    	let noticeOpacity = null;
    	let csspos = 'left';
    	let direction = 'X';
    	let span = 'Width';
    	let windowInnerWidth = window.innerWidth;
    	let offs = [];

    	onMount(() => {
    		offs = [
    			self.on('touchstart', e => {
    				if (!swipeDismiss) {
    					return;
    				}

    				const stack = self.stack;

    				if (stack) {
    					switch (stack.dir1) {
    						case 'up':
    						case 'down':
    							csspos = 'left';
    							direction = 'X';
    							span = 'Width';
    							break;
    						case 'left':
    						case 'right':
    							csspos = 'top';
    							direction = 'Y';
    							span = 'Height';
    							break;
    					}
    				}

    				origXY = e.touches[0][`screen${direction}`];
    				noticeWidthHeight = self.refs.elem[`scroll${span}`];
    				noticeOpacity = window.getComputedStyle(self.refs.elem)['opacity'];
    				$$invalidate(1, self.refs.container.style[csspos] = 0, self);
    			}),
    			self.on('touchmove', e => {
    				if (!origXY || !swipeDismiss) {
    					return;
    				}

    				const curXY = e.touches[0][`screen${direction}`];
    				diffXY = curXY - origXY;
    				const opacity = (1 - Math.abs(diffXY) / noticeWidthHeight) * noticeOpacity;
    				$$invalidate(1, self.refs.elem.style.opacity = opacity, self);
    				$$invalidate(1, self.refs.container.style[csspos] = `${diffXY}px`, self);
    			}),
    			self.on('touchend', () => {
    				if (!origXY || !swipeDismiss) {
    					return;
    				}

    				self.refs.container.classList.add('pnotify-mobile-animate-left');

    				if (Math.abs(diffXY) > 40) {
    					const goLeft = diffXY < 0
    					? noticeWidthHeight * -2
    					: noticeWidthHeight * 2;

    					$$invalidate(1, self.refs.elem.style.opacity = 0, self);
    					$$invalidate(1, self.refs.container.style[csspos] = `${goLeft}px`, self);
    					self.close();
    				} else {
    					self.refs.elem.style.removeProperty('opacity');
    					self.refs.container.style.removeProperty(csspos);
    				}

    				origXY = null;
    				diffXY = null;
    				noticeWidthHeight = null;
    				noticeOpacity = null;
    			}),
    			self.on('touchcancel', () => {
    				if (!origXY || !swipeDismiss) {
    					return;
    				}

    				self.refs.elem.style.removeProperty('opacity');
    				self.refs.container.style.removeProperty(csspos);
    				origXY = null;
    				diffXY = null;
    				noticeWidthHeight = null;
    				noticeOpacity = null;
    			}),
    			self.on('pnotify:afterClose', () => {
    				// Remove any styling we added to close it.
    				if (!swipeDismiss) {
    					return;
    				}

    				self.refs.elem.style.removeProperty('opacity');
    				self.refs.container.style.removeProperty('left');
    				self.refs.container.style.removeProperty('top');
    			})
    		];
    	});

    	onDestroy(() => {
    		offs.forEach(off => off());
    	});

    	const writable_props = ['self', 'swipeDismiss'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mobile> was created with unknown prop '${key}'`);
    	});

    	const resize_handler = () => $$invalidate(0, windowInnerWidth = window.innerWidth);

    	$$self.$$set = $$props => {
    		if ('self' in $$props) $$invalidate(1, self = $$props.self);
    		if ('swipeDismiss' in $$props) $$invalidate(2, swipeDismiss = $$props.swipeDismiss);
    	};

    	$$self.$capture_state = () => ({
    		position,
    		defaults,
    		onMount,
    		onDestroy,
    		self,
    		swipeDismiss,
    		origXY,
    		diffXY,
    		noticeWidthHeight,
    		noticeOpacity,
    		csspos,
    		direction,
    		span,
    		windowInnerWidth,
    		offs
    	});

    	$$self.$inject_state = $$props => {
    		if ('self' in $$props) $$invalidate(1, self = $$props.self);
    		if ('swipeDismiss' in $$props) $$invalidate(2, swipeDismiss = $$props.swipeDismiss);
    		if ('origXY' in $$props) origXY = $$props.origXY;
    		if ('diffXY' in $$props) diffXY = $$props.diffXY;
    		if ('noticeWidthHeight' in $$props) noticeWidthHeight = $$props.noticeWidthHeight;
    		if ('noticeOpacity' in $$props) noticeOpacity = $$props.noticeOpacity;
    		if ('csspos' in $$props) csspos = $$props.csspos;
    		if ('direction' in $$props) direction = $$props.direction;
    		if ('span' in $$props) span = $$props.span;
    		if ('windowInnerWidth' in $$props) $$invalidate(0, windowInnerWidth = $$props.windowInnerWidth);
    		if ('offs' in $$props) offs = $$props.offs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*self, windowInnerWidth*/ 3) {
    			{
    				const stack = self.stack;

    				if (stack) {
    					if (windowInnerWidth <= 480) {
    						if (!('_m_spacing1' in stack)) {
    							stack._m_spacing1 = stack.spacing1;
    							stack._m_firstpos1 = stack.firstpos1;
    							stack._m_spacing2 = stack.spacing2;
    							stack._m_firstpos2 = stack.firstpos2;
    							stack.spacing1 = 0;
    							stack.firstpos1 = 0;
    							stack.spacing2 = 0;
    							stack.firstpos2 = 0;
    							stack.queuePosition();
    						}
    					} else {
    						if ('_m_spacing1' in stack) {
    							stack.spacing1 = stack._m_spacing1;
    							delete stack._m_spacing1;
    							stack.firstpos1 = stack._m_firstpos1;
    							delete stack._m_firstpos1;
    							stack.spacing2 = stack._m_spacing2;
    							delete stack._m_spacing2;
    							stack.firstpos2 = stack._m_firstpos2;
    							delete stack._m_firstpos2;
    							stack.queuePosition();
    						}
    					}
    				}
    			}
    		}
    	};

    	return [windowInnerWidth, self, swipeDismiss, resize_handler];
    }

    class Mobile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { self: 1, swipeDismiss: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mobile",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get self() {
    		throw new Error("<Mobile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set self(value) {
    		throw new Error("<Mobile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swipeDismiss() {
    		throw new Error("<Mobile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swipeDismiss(value) {
    		throw new Error("<Mobile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var PNotifyMobile = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Mobile,
        position: position,
        defaults: defaults
    });

    /* src/components/LoginPgae.svelte generated by Svelte v3.44.3 */

    const { console: console_1$5 } = globals;
    const file$6 = "src/components/LoginPgae.svelte";

    // (101:12) {:else}
    function create_else_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Log In");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(101:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (97:12) {#if load}
    function create_if_block$4(ctx) {
    	let div;
    	let facebookloader;
    	let current;
    	facebookloader = new FacebookLoader({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(facebookloader.$$.fragment);
    			attr_dev(div, "class", "loader svelte-14jqysd");
    			add_location(div, file$6, 97, 12, 2984);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(facebookloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(facebookloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(facebookloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(facebookloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(97:12) {#if load}",
    		ctx
    	});

    	return block;
    }

    // (96:8) <Button color="primary" dark block disabled={load} on:click={submitHandler}>
    function create_default_slot$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*load*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(96:8) <Button color=\\\"primary\\\" dark block disabled={load} on:click={submitHandler}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let fareguser;
    	let t0;
    	let h6;
    	let t2;
    	let form;
    	let textfield0;
    	let updating_value;
    	let t3;
    	let textfield1;
    	let updating_value_1;
    	let t4;
    	let div2;
    	let a;
    	let t6;
    	let p;
    	let t8;
    	let div3;
    	let button;
    	let current;
    	fareguser = new FaRegUser({ $$inline: true });

    	function textfield0_value_binding(value) {
    		/*textfield0_value_binding*/ ctx[3](value);
    	}

    	let textfield0_props = {
    		label: "Email",
    		outlined: true,
    		hint: "a@xyz.com",
    		type: "email"
    	};

    	if (/*fields*/ ctx[0].username !== void 0) {
    		textfield0_props.value = /*fields*/ ctx[0].username;
    	}

    	textfield0 = new TextField({ props: textfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield0, 'value', textfield0_value_binding));

    	function textfield1_value_binding(value) {
    		/*textfield1_value_binding*/ ctx[4](value);
    	}

    	let textfield1_props = {
    		label: "Password",
    		outlined: true,
    		hint: "Password",
    		type: "password"
    	};

    	if (/*fields*/ ctx[0].password !== void 0) {
    		textfield1_props.value = /*fields*/ ctx[0].password;
    	}

    	textfield1 = new TextField({ props: textfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield1, 'value', textfield1_value_binding));

    	button = new Button({
    			props: {
    				color: "primary",
    				dark: true,
    				block: true,
    				disabled: /*load*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*submitHandler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fareguser.$$.fragment);
    			t0 = space();
    			h6 = element("h6");
    			h6.textContent = "Have an account?";
    			t2 = space();
    			form = element("form");
    			create_component(textfield0.$$.fragment);
    			t3 = space();
    			create_component(textfield1.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			a = element("a");
    			a.textContent = "Sign In";
    			t6 = space();
    			p = element("p");
    			p.textContent = "Forget Password";
    			t8 = space();
    			div3 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "avatar-icon svelte-14jqysd");
    			add_location(div0, file$6, 78, 8, 2327);
    			attr_dev(h6, "class", "text svelte-14jqysd");
    			add_location(h6, file$6, 81, 8, 2402);
    			attr_dev(div1, "class", "icon svelte-14jqysd");
    			add_location(div1, file$6, 77, 4, 2300);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "login svelte-14jqysd");
    			add_location(form, file$6, 84, 4, 2457);
    			attr_dev(a, "class", "text1 svelte-14jqysd");
    			attr_dev(a, "href", "/");
    			add_location(a, file$6, 90, 8, 2746);
    			attr_dev(p, "class", "text1 svelte-14jqysd");
    			add_location(p, file$6, 91, 8, 2792);
    			attr_dev(div2, "class", "signin svelte-14jqysd");
    			add_location(div2, file$6, 89, 4, 2717);
    			attr_dev(div3, "class", "btn svelte-14jqysd");
    			add_location(div3, file$6, 94, 4, 2845);
    			attr_dev(div4, "class", "main svelte-14jqysd");
    			add_location(div4, file$6, 76, 0, 2277);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			mount_component(fareguser, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, h6);
    			append_dev(div4, t2);
    			append_dev(div4, form);
    			mount_component(textfield0, form, null);
    			append_dev(form, t3);
    			mount_component(textfield1, form, null);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div2, a);
    			append_dev(div2, t6);
    			append_dev(div2, p);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			mount_component(button, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const textfield0_changes = {};

    			if (!updating_value && dirty & /*fields*/ 1) {
    				updating_value = true;
    				textfield0_changes.value = /*fields*/ ctx[0].username;
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield0.$set(textfield0_changes);
    			const textfield1_changes = {};

    			if (!updating_value_1 && dirty & /*fields*/ 1) {
    				updating_value_1 = true;
    				textfield1_changes.value = /*fields*/ ctx[0].password;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textfield1.$set(textfield1_changes);
    			const button_changes = {};
    			if (dirty & /*load*/ 2) button_changes.disabled = /*load*/ ctx[1];

    			if (dirty & /*$$scope, load*/ 130) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fareguser.$$.fragment, local);
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fareguser.$$.fragment, local);
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(fareguser);
    			destroy_component(textfield0);
    			destroy_component(textfield1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoginPgae', slots, []);
    	defaultModules.set(PNotifyMobile, {});

    	function myErrorAlert(errorMsg) {
    		error({ text: errorMsg });
    	}

    	let fields = { username: "", password: "" };
    	let valid = false;
    	let load = false;

    	const submitHandler = async () => {
    		valid = true;
    		$$invalidate(1, load = true);

    		if (fields.username.trim().length < 1) {
    			valid = false;
    			myErrorAlert('You need an email');
    			return;
    		}

    		if (fields.password.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Insert a password');
    			return;
    		}

    		if (valid) {
    			try {
    				const data = {
    					username: fields.username,
    					password: fields.password
    				};

    				const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/login', {
    					method: 'POST',
    					headers: {
    						'Accept': 'application/json',
    						'Content-Type': 'application/json'
    					},
    					body: JSON.stringify(data)
    				});

    				const content = await rawResponse.json(data);

    				// console.log(content)
    				if (content.success == true) {
    					user.set(content.newUser);
    					localStorage.setItem('user', JSON.stringify(content.newUser));
    					page.redirect('/add-vehicle');
    				} else {
    					console.log('incorrect username or password');
    					myErrorAlert('incorrect username or password');
    					$$invalidate(1, load = false);
    				}
    			} catch(error) {
    				console.log(error);
    				myErrorAlert(error);
    				$$invalidate(1, load = false);
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<LoginPgae> was created with unknown prop '${key}'`);
    	});

    	function textfield0_value_binding(value) {
    		if ($$self.$$.not_equal(fields.username, value)) {
    			fields.username = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield1_value_binding(value) {
    		if ($$self.$$.not_equal(fields.password, value)) {
    			fields.password = value;
    			$$invalidate(0, fields);
    		}
    	}

    	$$self.$capture_state = () => ({
    		FaRegUser,
    		TextField,
    		Button,
    		Icon,
    		FacebookLoader,
    		user,
    		router: page,
    		alert,
    		notice,
    		info,
    		success,
    		error,
    		defaultModules,
    		PNotifyMobile,
    		myErrorAlert,
    		fields,
    		valid,
    		load,
    		submitHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
    		if ('valid' in $$props) valid = $$props.valid;
    		if ('load' in $$props) $$invalidate(1, load = $$props.load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fields,
    		load,
    		submitHandler,
    		textfield0_value_binding,
    		textfield1_value_binding
    	];
    }

    class LoginPgae extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoginPgae",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/AddVehicle.svelte generated by Svelte v3.44.3 */

    const { console: console_1$4 } = globals;
    const file$5 = "src/components/AddVehicle.svelte";

    // (135:24) {:else}
    function create_else_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("ADD VEHICLE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(135:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (131:20) {#if load}
    function create_if_block$3(ctx) {
    	let div;
    	let facebookloader;
    	let current;
    	facebookloader = new FacebookLoader({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(facebookloader.$$.fragment);
    			attr_dev(div, "class", "loader svelte-1eflar5");
    			add_location(div, file$5, 131, 24, 3724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(facebookloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(facebookloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(facebookloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(facebookloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(131:20) {#if load}",
    		ctx
    	});

    	return block;
    }

    // (130:16) <Button color="primary" dark block disabled={load} on:click={submitHandler}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*load*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(130:16) <Button color=\\\"primary\\\" dark block disabled={load} on:click={submitHandler}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div6;
    	let nav;
    	let t0;
    	let vertical;
    	let t1;
    	let div5;
    	let header;
    	let t2;
    	let form;
    	let div0;
    	let textfield0;
    	let updating_value;
    	let t3;
    	let div1;
    	let textfield1;
    	let updating_value_1;
    	let t4;
    	let div2;
    	let textfield2;
    	let updating_value_2;
    	let t5;
    	let div3;
    	let textfield3;
    	let updating_value_3;
    	let t6;
    	let div4;
    	let button;
    	let current;

    	nav = new Nav({
    			props: { activeAddVehicle: true },
    			$$inline: true
    		});

    	vertical = new Vertical({ $$inline: true });
    	header = new Header({ $$inline: true });

    	function textfield0_value_binding(value) {
    		/*textfield0_value_binding*/ ctx[4](value);
    	}

    	let textfield0_props = {
    		label: "Vehicle Name",
    		outlined: true,
    		hint: "Toyota"
    	};

    	if (/*fields*/ ctx[0].vehicleName !== void 0) {
    		textfield0_props.value = /*fields*/ ctx[0].vehicleName;
    	}

    	textfield0 = new TextField({ props: textfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield0, 'value', textfield0_value_binding));

    	function textfield1_value_binding(value) {
    		/*textfield1_value_binding*/ ctx[5](value);
    	}

    	let textfield1_props = {
    		label: "Brand Name",
    		outlined: true,
    		hint: "Toyota camry"
    	};

    	if (/*fields*/ ctx[0].brandName !== void 0) {
    		textfield1_props.value = /*fields*/ ctx[0].brandName;
    	}

    	textfield1 = new TextField({ props: textfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield1, 'value', textfield1_value_binding));

    	function textfield2_value_binding(value) {
    		/*textfield2_value_binding*/ ctx[6](value);
    	}

    	let textfield2_props = {
    		label: "Year of purchase",
    		outlined: true,
    		hint: "year"
    	};

    	if (/*fields*/ ctx[0].yearOfPurchase !== void 0) {
    		textfield2_props.value = /*fields*/ ctx[0].yearOfPurchase;
    	}

    	textfield2 = new TextField({ props: textfield2_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield2, 'value', textfield2_value_binding));

    	function textfield3_value_binding(value) {
    		/*textfield3_value_binding*/ ctx[7](value);
    	}

    	let textfield3_props = {
    		label: "Color",
    		outlined: true,
    		hint: "grey"
    	};

    	if (/*fields*/ ctx[0].color !== void 0) {
    		textfield3_props.value = /*fields*/ ctx[0].color;
    	}

    	textfield3 = new TextField({ props: textfield3_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield3, 'value', textfield3_value_binding));

    	button = new Button({
    			props: {
    				color: "primary",
    				dark: true,
    				block: true,
    				disabled: /*load*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*submitHandler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(vertical.$$.fragment);
    			t1 = space();
    			div5 = element("div");
    			create_component(header.$$.fragment);
    			t2 = space();
    			form = element("form");
    			div0 = element("div");
    			create_component(textfield0.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(textfield1.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			create_component(textfield2.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			create_component(textfield3.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "svelte-1eflar5");
    			add_location(div0, file$5, 106, 12, 2976);
    			attr_dev(div1, "class", "svelte-1eflar5");
    			add_location(div1, file$5, 111, 12, 3121);
    			attr_dev(div2, "class", "svelte-1eflar5");
    			add_location(div2, file$5, 116, 12, 3267);
    			attr_dev(div3, "class", "svelte-1eflar5");
    			add_location(div3, file$5, 121, 12, 3416);
    			attr_dev(div4, "class", "btn svelte-1eflar5");
    			add_location(div4, file$5, 127, 12, 3557);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "form svelte-1eflar5");
    			add_location(form, file$5, 105, 8, 2933);
    			attr_dev(div5, "class", "align svelte-1eflar5");
    			add_location(div5, file$5, 103, 4, 2887);
    			attr_dev(div6, "class", "main svelte-1eflar5");
    			add_location(div6, file$5, 98, 0, 2823);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			mount_component(nav, div6, null);
    			append_dev(div6, t0);
    			mount_component(vertical, div6, null);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			mount_component(header, div5, null);
    			append_dev(div5, t2);
    			append_dev(div5, form);
    			append_dev(form, div0);
    			mount_component(textfield0, div0, null);
    			append_dev(form, t3);
    			append_dev(form, div1);
    			mount_component(textfield1, div1, null);
    			append_dev(form, t4);
    			append_dev(form, div2);
    			mount_component(textfield2, div2, null);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			mount_component(textfield3, div3, null);
    			append_dev(form, t6);
    			append_dev(form, div4);
    			mount_component(button, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const textfield0_changes = {};

    			if (!updating_value && dirty & /*fields*/ 1) {
    				updating_value = true;
    				textfield0_changes.value = /*fields*/ ctx[0].vehicleName;
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield0.$set(textfield0_changes);
    			const textfield1_changes = {};

    			if (!updating_value_1 && dirty & /*fields*/ 1) {
    				updating_value_1 = true;
    				textfield1_changes.value = /*fields*/ ctx[0].brandName;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textfield1.$set(textfield1_changes);
    			const textfield2_changes = {};

    			if (!updating_value_2 && dirty & /*fields*/ 1) {
    				updating_value_2 = true;
    				textfield2_changes.value = /*fields*/ ctx[0].yearOfPurchase;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			textfield2.$set(textfield2_changes);
    			const textfield3_changes = {};

    			if (!updating_value_3 && dirty & /*fields*/ 1) {
    				updating_value_3 = true;
    				textfield3_changes.value = /*fields*/ ctx[0].color;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			textfield3.$set(textfield3_changes);
    			const button_changes = {};
    			if (dirty & /*load*/ 2) button_changes.disabled = /*load*/ ctx[1];

    			if (dirty & /*$$scope, load*/ 4098) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(vertical.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(textfield2.$$.fragment, local);
    			transition_in(textfield3.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(vertical.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(textfield2.$$.fragment, local);
    			transition_out(textfield3.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(nav);
    			destroy_component(vertical);
    			destroy_component(header);
    			destroy_component(textfield0);
    			destroy_component(textfield1);
    			destroy_component(textfield2);
    			destroy_component(textfield3);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(9, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddVehicle', slots, []);
    	defaultModules.set(PNotifyMobile, {});

    	function myErrorAlert(errorMsg) {
    		error({ text: errorMsg });
    	}

    	let { active } = $$props;
    	let activeAddVehicle = active;

    	let fields = {
    		vehicleName: "",
    		brandName: "",
    		yearOfPurchase: "",
    		color: ""
    	};

    	let valid = false;
    	let load = false;

    	const submitHandler = async () => {
    		console.log($user);
    		valid = true;
    		$$invalidate(1, load = true);
    		console.log('hello');

    		if (fields.vehicleName.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Vehicle Name must not be empty');
    			$$invalidate(1, load = false);
    			return;
    		}

    		if (fields.brandName.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Brand Name must not be empty');
    			$$invalidate(1, load = false);
    			return;
    		}

    		if (fields.yearOfPurchase.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Year of purchase must not be empty');
    			$$invalidate(1, load = false);
    			return;
    		}

    		if (fields.color.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Color must not be empty');
    			$$invalidate(1, load = false);
    			return;
    		}

    		if (valid) {
    			console.log(fields);

    			try {
    				const data = {
    					username: $user.username,
    					vehicle: fields
    				};

    				const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/add-vehicle', {
    					method: 'PUT',
    					headers: {
    						'Accept': 'application/json',
    						'Content-Type': 'application/json'
    					},
    					body: JSON.stringify(data)
    				});

    				const content = await rawResponse.json(data);
    				console.log(content);

    				if (content.success == true) {
    					console.log('vehicle added');
    					user.set(content.user);
    					localStorage.setItem('user', JSON.stringify(content.user));
    					myErrorAlert('Vehicle Added!!');
    					$$invalidate(1, load = false);
    				}
    			} catch(error) {
    				console.log(error);
    				myErrorAlert(error);
    				$$invalidate(1, load = false);
    			}
    		}
    	};

    	const writable_props = ['active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<AddVehicle> was created with unknown prop '${key}'`);
    	});

    	function textfield0_value_binding(value) {
    		if ($$self.$$.not_equal(fields.vehicleName, value)) {
    			fields.vehicleName = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield1_value_binding(value) {
    		if ($$self.$$.not_equal(fields.brandName, value)) {
    			fields.brandName = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield2_value_binding(value) {
    		if ($$self.$$.not_equal(fields.yearOfPurchase, value)) {
    			fields.yearOfPurchase = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield3_value_binding(value) {
    		if ($$self.$$.not_equal(fields.color, value)) {
    			fields.color = value;
    			$$invalidate(0, fields);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Vertical,
    		Nav,
    		TextField,
    		Button,
    		Icon,
    		FacebookLoader,
    		user,
    		alert,
    		notice,
    		info,
    		success,
    		error,
    		defaultModules,
    		PNotifyMobile,
    		myErrorAlert,
    		active,
    		activeAddVehicle,
    		fields,
    		valid,
    		load,
    		submitHandler,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    		if ('activeAddVehicle' in $$props) activeAddVehicle = $$props.activeAddVehicle;
    		if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
    		if ('valid' in $$props) valid = $$props.valid;
    		if ('load' in $$props) $$invalidate(1, load = $$props.load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fields,
    		load,
    		submitHandler,
    		active,
    		textfield0_value_binding,
    		textfield1_value_binding,
    		textfield2_value_binding,
    		textfield3_value_binding
    	];
    }

    class AddVehicle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddVehicle",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*active*/ ctx[3] === undefined && !('active' in props)) {
    			console_1$4.warn("<AddVehicle> was created without expected prop 'active'");
    		}
    	}

    	get active() {
    		throw new Error("<AddVehicle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<AddVehicle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/StaffProfile.svelte generated by Svelte v3.44.3 */

    const { console: console_1$3 } = globals;
    const file$4 = "src/components/StaffProfile.svelte";

    // (35:12) <Avatar type="medium">
    function create_default_slot_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "img-avat svelte-10e1vll");
    			if (!src_url_equal(img.src, img_src_value = "../musty-avatar.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$4, 35, 16, 910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(35:12) <Avatar type=\\\"medium\\\">",
    		ctx
    	});

    	return block;
    }

    // (39:12) <Button color="primary" light flat >
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("set");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(39:12) <Button color=\\\"primary\\\" light flat >",
    		ctx
    	});

    	return block;
    }

    // (75:8) {:else}
    function create_else_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "...loading";
    			add_location(p, file$4, 75, 12, 2057);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(75:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {#if userLocal}
    function create_if_block$2(ctx) {
    	let form;
    	let div0;
    	let textfield0;
    	let updating_value;
    	let t0;
    	let div1;
    	let textfield1;
    	let updating_value_1;
    	let t1;
    	let div2;
    	let textfield2;
    	let updating_value_2;
    	let t2;
    	let div3;
    	let textfield3;
    	let updating_value_3;
    	let t3;
    	let div4;
    	let textfield4;
    	let updating_value_4;
    	let current;

    	function textfield0_value_binding(value) {
    		/*textfield0_value_binding*/ ctx[3](value);
    	}

    	let textfield0_props = {
    		label: "First Name",
    		outlined: true,
    		hint: "First Name",
    		disabled: true
    	};

    	if (/*fields*/ ctx[0].firstName !== void 0) {
    		textfield0_props.value = /*fields*/ ctx[0].firstName;
    	}

    	textfield0 = new TextField({ props: textfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield0, 'value', textfield0_value_binding));

    	function textfield1_value_binding(value) {
    		/*textfield1_value_binding*/ ctx[4](value);
    	}

    	let textfield1_props = {
    		label: "Surname",
    		outlined: true,
    		hint: "Surname",
    		disabled: true
    	};

    	if (/*fields*/ ctx[0].surname !== void 0) {
    		textfield1_props.value = /*fields*/ ctx[0].surname;
    	}

    	textfield1 = new TextField({ props: textfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield1, 'value', textfield1_value_binding));

    	function textfield2_value_binding(value) {
    		/*textfield2_value_binding*/ ctx[5](value);
    	}

    	let textfield2_props = {
    		label: "Email",
    		outlined: true,
    		hint: "ID",
    		disabled: true
    	};

    	if (/*fields*/ ctx[0].email !== void 0) {
    		textfield2_props.value = /*fields*/ ctx[0].email;
    	}

    	textfield2 = new TextField({ props: textfield2_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield2, 'value', textfield2_value_binding));

    	function textfield3_value_binding(value) {
    		/*textfield3_value_binding*/ ctx[6](value);
    	}

    	let textfield3_props = {
    		label: "Phone",
    		outlined: true,
    		hint: "Phone",
    		disabled: true
    	};

    	if (/*fields*/ ctx[0].phone !== void 0) {
    		textfield3_props.value = /*fields*/ ctx[0].phone;
    	}

    	textfield3 = new TextField({ props: textfield3_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield3, 'value', textfield3_value_binding));

    	function textfield4_value_binding(value) {
    		/*textfield4_value_binding*/ ctx[7](value);
    	}

    	let textfield4_props = {
    		label: "Address",
    		outlined: true,
    		hint: "Address",
    		disabled: true
    	};

    	if (/*fields*/ ctx[0].address !== void 0) {
    		textfield4_props.value = /*fields*/ ctx[0].address;
    	}

    	textfield4 = new TextField({ props: textfield4_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield4, 'value', textfield4_value_binding));

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			create_component(textfield0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(textfield1.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(textfield2.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(textfield3.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			create_component(textfield4.$$.fragment);
    			attr_dev(div0, "class", "svelte-10e1vll");
    			add_location(div0, file$4, 44, 16, 1198);
    			attr_dev(div1, "class", "svelte-10e1vll");
    			add_location(div1, file$4, 49, 16, 1364);
    			attr_dev(div2, "class", "svelte-10e1vll");
    			add_location(div2, file$4, 56, 16, 1539);
    			attr_dev(div3, "class", "svelte-10e1vll");
    			add_location(div3, file$4, 62, 16, 1704);
    			attr_dev(div4, "class", "svelte-10e1vll");
    			add_location(div4, file$4, 67, 16, 1855);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "form svelte-10e1vll");
    			add_location(form, file$4, 43, 12, 1151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			mount_component(textfield0, div0, null);
    			append_dev(form, t0);
    			append_dev(form, div1);
    			mount_component(textfield1, div1, null);
    			append_dev(form, t1);
    			append_dev(form, div2);
    			mount_component(textfield2, div2, null);
    			append_dev(form, t2);
    			append_dev(form, div3);
    			mount_component(textfield3, div3, null);
    			append_dev(form, t3);
    			append_dev(form, div4);
    			mount_component(textfield4, div4, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textfield0_changes = {};

    			if (!updating_value && dirty & /*fields*/ 1) {
    				updating_value = true;
    				textfield0_changes.value = /*fields*/ ctx[0].firstName;
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield0.$set(textfield0_changes);
    			const textfield1_changes = {};

    			if (!updating_value_1 && dirty & /*fields*/ 1) {
    				updating_value_1 = true;
    				textfield1_changes.value = /*fields*/ ctx[0].surname;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textfield1.$set(textfield1_changes);
    			const textfield2_changes = {};

    			if (!updating_value_2 && dirty & /*fields*/ 1) {
    				updating_value_2 = true;
    				textfield2_changes.value = /*fields*/ ctx[0].email;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			textfield2.$set(textfield2_changes);
    			const textfield3_changes = {};

    			if (!updating_value_3 && dirty & /*fields*/ 1) {
    				updating_value_3 = true;
    				textfield3_changes.value = /*fields*/ ctx[0].phone;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			textfield3.$set(textfield3_changes);
    			const textfield4_changes = {};

    			if (!updating_value_4 && dirty & /*fields*/ 1) {
    				updating_value_4 = true;
    				textfield4_changes.value = /*fields*/ ctx[0].address;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			textfield4.$set(textfield4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(textfield2.$$.fragment, local);
    			transition_in(textfield3.$$.fragment, local);
    			transition_in(textfield4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(textfield2.$$.fragment, local);
    			transition_out(textfield3.$$.fragment, local);
    			transition_out(textfield4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(textfield0);
    			destroy_component(textfield1);
    			destroy_component(textfield2);
    			destroy_component(textfield3);
    			destroy_component(textfield4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(43:8) {#if userLocal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let nav;
    	let t0;
    	let vertical;
    	let t1;
    	let div1;
    	let header;
    	let t2;
    	let div0;
    	let avatar;
    	let t3;
    	let textfield;
    	let t4;
    	let button;
    	let t5;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	nav = new Nav({
    			props: { activeProfile: true },
    			$$inline: true
    		});

    	vertical = new Vertical({ $$inline: true });
    	header = new Header({ $$inline: true });

    	avatar = new Avatar({
    			props: {
    				type: "medium",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textfield = new TextField({
    			props: { outlined: true, type: "file" },
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				color: "primary",
    				light: true,
    				flat: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*userLocal*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(vertical.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(header.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			create_component(avatar.$$.fragment);
    			t3 = space();
    			create_component(textfield.$$.fragment);
    			t4 = space();
    			create_component(button.$$.fragment);
    			t5 = space();
    			if_block.c();
    			attr_dev(div0, "class", "profile-pic svelte-10e1vll");
    			add_location(div0, file$4, 33, 8, 833);
    			attr_dev(div1, "class", "align svelte-10e1vll");
    			add_location(div1, file$4, 30, 4, 785);
    			attr_dev(div2, "class", "main svelte-10e1vll");
    			add_location(div2, file$4, 25, 0, 724);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(nav, div2, null);
    			append_dev(div2, t0);
    			mount_component(vertical, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(header, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(avatar, div0, null);
    			append_dev(div0, t3);
    			mount_component(textfield, div0, null);
    			append_dev(div0, t4);
    			mount_component(button, div0, null);
    			append_dev(div1, t5);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const avatar_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				avatar_changes.$$scope = { dirty, ctx };
    			}

    			avatar.$set(avatar_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(vertical.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(avatar.$$.fragment, local);
    			transition_in(textfield.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(vertical.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(avatar.$$.fragment, local);
    			transition_out(textfield.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(nav);
    			destroy_component(vertical);
    			destroy_component(header);
    			destroy_component(avatar);
    			destroy_component(textfield);
    			destroy_component(button);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StaffProfile', slots, []);
    	let { active } = $$props;
    	let activeProfile = active;
    	let userLocal = JSON.parse(localStorage.getItem('user'));
    	console.log(userLocal);
    	let fields;

    	try {
    		if (userLocal) {
    			fields = {
    				firstName: userLocal.firstName,
    				surname: userLocal.lastName,
    				email: userLocal.username,
    				phone: userLocal.phone,
    				address: userLocal.address
    			};
    		}
    	} catch(error) {
    		console.log(error);
    	}

    	const writable_props = ['active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<StaffProfile> was created with unknown prop '${key}'`);
    	});

    	function textfield0_value_binding(value) {
    		if ($$self.$$.not_equal(fields.firstName, value)) {
    			fields.firstName = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield1_value_binding(value) {
    		if ($$self.$$.not_equal(fields.surname, value)) {
    			fields.surname = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield2_value_binding(value) {
    		if ($$self.$$.not_equal(fields.email, value)) {
    			fields.email = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield3_value_binding(value) {
    		if ($$self.$$.not_equal(fields.phone, value)) {
    			fields.phone = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield4_value_binding(value) {
    		if ($$self.$$.not_equal(fields.address, value)) {
    			fields.address = value;
    			$$invalidate(0, fields);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Vertical,
    		Nav,
    		TextField,
    		Button,
    		Icon,
    		Avatar,
    		user,
    		active,
    		activeProfile,
    		userLocal,
    		fields
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('activeProfile' in $$props) activeProfile = $$props.activeProfile;
    		if ('userLocal' in $$props) $$invalidate(1, userLocal = $$props.userLocal);
    		if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fields,
    		userLocal,
    		active,
    		textfield0_value_binding,
    		textfield1_value_binding,
    		textfield2_value_binding,
    		textfield3_value_binding,
    		textfield4_value_binding
    	];
    }

    class StaffProfile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { active: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StaffProfile",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*active*/ ctx[2] === undefined && !('active' in props)) {
    			console_1$3.warn("<StaffProfile> was created without expected prop 'active'");
    		}
    	}

    	get active() {
    		throw new Error("<StaffProfile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<StaffProfile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Registration.svelte generated by Svelte v3.44.3 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/components/Registration.svelte";

    // (151:16) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SIGN IN");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(151:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (147:16) {#if load}
    function create_if_block$1(ctx) {
    	let div;
    	let facebookloader;
    	let current;
    	facebookloader = new FacebookLoader({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(facebookloader.$$.fragment);
    			attr_dev(div, "class", "loader svelte-b0kym8");
    			add_location(div, file$3, 147, 16, 4342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(facebookloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(facebookloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(facebookloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(facebookloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(147:16) {#if load}",
    		ctx
    	});

    	return block;
    }

    // (146:12) <Button color="primary" dark block disabled={load} on:click={submitHandler}>
    function create_default_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*load*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(146:12) <Button color=\\\"primary\\\" dark block disabled={load} on:click={submitHandler}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let fareguser;
    	let t0;
    	let h6;
    	let t2;
    	let form;
    	let textfield0;
    	let updating_value;
    	let t3;
    	let textfield1;
    	let updating_value_1;
    	let t4;
    	let textfield2;
    	let updating_value_2;
    	let t5;
    	let textfield3;
    	let updating_value_3;
    	let t6;
    	let textfield4;
    	let updating_value_4;
    	let t7;
    	let textfield5;
    	let updating_value_5;
    	let t8;
    	let textfield6;
    	let updating_value_6;
    	let t9;
    	let div3;
    	let a;
    	let t11;
    	let div2;
    	let button;
    	let current;
    	fareguser = new FaRegUser({ $$inline: true });

    	function textfield0_value_binding(value) {
    		/*textfield0_value_binding*/ ctx[3](value);
    	}

    	let textfield0_props = {
    		label: "First Name",
    		outlined: true,
    		hint: "John "
    	};

    	if (/*fields*/ ctx[0].firstName !== void 0) {
    		textfield0_props.value = /*fields*/ ctx[0].firstName;
    	}

    	textfield0 = new TextField({ props: textfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield0, 'value', textfield0_value_binding));

    	function textfield1_value_binding(value) {
    		/*textfield1_value_binding*/ ctx[4](value);
    	}

    	let textfield1_props = {
    		label: "Last Name",
    		outlined: true,
    		hint: "Doe "
    	};

    	if (/*fields*/ ctx[0].lastName !== void 0) {
    		textfield1_props.value = /*fields*/ ctx[0].lastName;
    	}

    	textfield1 = new TextField({ props: textfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield1, 'value', textfield1_value_binding));

    	function textfield2_value_binding(value) {
    		/*textfield2_value_binding*/ ctx[5](value);
    	}

    	let textfield2_props = {
    		label: "Address",
    		outlined: true,
    		hint: "Jimeta "
    	};

    	if (/*fields*/ ctx[0].address !== void 0) {
    		textfield2_props.value = /*fields*/ ctx[0].address;
    	}

    	textfield2 = new TextField({ props: textfield2_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield2, 'value', textfield2_value_binding));

    	function textfield3_value_binding(value) {
    		/*textfield3_value_binding*/ ctx[6](value);
    	}

    	let textfield3_props = {
    		label: "phone",
    		outlined: true,
    		hint: "+234"
    	};

    	if (/*fields*/ ctx[0].phone !== void 0) {
    		textfield3_props.value = /*fields*/ ctx[0].phone;
    	}

    	textfield3 = new TextField({ props: textfield3_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield3, 'value', textfield3_value_binding));

    	function textfield4_value_binding(value) {
    		/*textfield4_value_binding*/ ctx[7](value);
    	}

    	let textfield4_props = {
    		label: "mail",
    		outlined: true,
    		hint: "@xyz.com "
    	};

    	if (/*fields*/ ctx[0].username !== void 0) {
    		textfield4_props.value = /*fields*/ ctx[0].username;
    	}

    	textfield4 = new TextField({ props: textfield4_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield4, 'value', textfield4_value_binding));

    	function textfield5_value_binding(value) {
    		/*textfield5_value_binding*/ ctx[8](value);
    	}

    	let textfield5_props = {
    		label: "Password",
    		outlined: true,
    		hint: "Password",
    		type: "password"
    	};

    	if (/*fields*/ ctx[0].password !== void 0) {
    		textfield5_props.value = /*fields*/ ctx[0].password;
    	}

    	textfield5 = new TextField({ props: textfield5_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield5, 'value', textfield5_value_binding));

    	function textfield6_value_binding(value) {
    		/*textfield6_value_binding*/ ctx[9](value);
    	}

    	let textfield6_props = {
    		label: "Confirm Password",
    		outlined: true,
    		hint: "password",
    		type: "password"
    	};

    	if (/*fields*/ ctx[0].confirmPassword !== void 0) {
    		textfield6_props.value = /*fields*/ ctx[0].confirmPassword;
    	}

    	textfield6 = new TextField({ props: textfield6_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield6, 'value', textfield6_value_binding));

    	button = new Button({
    			props: {
    				color: "primary",
    				dark: true,
    				block: true,
    				disabled: /*load*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*submitHandler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fareguser.$$.fragment);
    			t0 = space();
    			h6 = element("h6");
    			h6.textContent = "Don't have an account?";
    			t2 = space();
    			form = element("form");
    			create_component(textfield0.$$.fragment);
    			t3 = space();
    			create_component(textfield1.$$.fragment);
    			t4 = space();
    			create_component(textfield2.$$.fragment);
    			t5 = space();
    			create_component(textfield3.$$.fragment);
    			t6 = space();
    			create_component(textfield4.$$.fragment);
    			t7 = space();
    			create_component(textfield5.$$.fragment);
    			t8 = space();
    			create_component(textfield6.$$.fragment);
    			t9 = space();
    			div3 = element("div");
    			a = element("a");
    			a.textContent = "Log In";
    			t11 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "avatar-icon svelte-b0kym8");
    			add_location(div0, file$3, 125, 8, 3247);
    			attr_dev(h6, "class", "text svelte-b0kym8");
    			add_location(h6, file$3, 128, 8, 3322);
    			attr_dev(div1, "class", "icon svelte-b0kym8");
    			add_location(div1, file$3, 124, 4, 3220);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "login svelte-b0kym8");
    			add_location(form, file$3, 131, 4, 3383);
    			attr_dev(a, "class", "text1 svelte-b0kym8");
    			attr_dev(a, "href", "/login");
    			add_location(a, file$3, 143, 8, 4141);
    			attr_dev(div2, "class", "btn svelte-b0kym8");
    			add_location(div2, file$3, 144, 8, 4191);
    			attr_dev(div3, "class", "signin svelte-b0kym8");
    			add_location(div3, file$3, 142, 4, 4112);
    			attr_dev(div4, "class", "main svelte-b0kym8");
    			add_location(div4, file$3, 123, 0, 3197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			mount_component(fareguser, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, h6);
    			append_dev(div4, t2);
    			append_dev(div4, form);
    			mount_component(textfield0, form, null);
    			append_dev(form, t3);
    			mount_component(textfield1, form, null);
    			append_dev(form, t4);
    			mount_component(textfield2, form, null);
    			append_dev(form, t5);
    			mount_component(textfield3, form, null);
    			append_dev(form, t6);
    			mount_component(textfield4, form, null);
    			append_dev(form, t7);
    			mount_component(textfield5, form, null);
    			append_dev(form, t8);
    			mount_component(textfield6, form, null);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, a);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			mount_component(button, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const textfield0_changes = {};

    			if (!updating_value && dirty & /*fields*/ 1) {
    				updating_value = true;
    				textfield0_changes.value = /*fields*/ ctx[0].firstName;
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield0.$set(textfield0_changes);
    			const textfield1_changes = {};

    			if (!updating_value_1 && dirty & /*fields*/ 1) {
    				updating_value_1 = true;
    				textfield1_changes.value = /*fields*/ ctx[0].lastName;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textfield1.$set(textfield1_changes);
    			const textfield2_changes = {};

    			if (!updating_value_2 && dirty & /*fields*/ 1) {
    				updating_value_2 = true;
    				textfield2_changes.value = /*fields*/ ctx[0].address;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			textfield2.$set(textfield2_changes);
    			const textfield3_changes = {};

    			if (!updating_value_3 && dirty & /*fields*/ 1) {
    				updating_value_3 = true;
    				textfield3_changes.value = /*fields*/ ctx[0].phone;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			textfield3.$set(textfield3_changes);
    			const textfield4_changes = {};

    			if (!updating_value_4 && dirty & /*fields*/ 1) {
    				updating_value_4 = true;
    				textfield4_changes.value = /*fields*/ ctx[0].username;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			textfield4.$set(textfield4_changes);
    			const textfield5_changes = {};

    			if (!updating_value_5 && dirty & /*fields*/ 1) {
    				updating_value_5 = true;
    				textfield5_changes.value = /*fields*/ ctx[0].password;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			textfield5.$set(textfield5_changes);
    			const textfield6_changes = {};

    			if (!updating_value_6 && dirty & /*fields*/ 1) {
    				updating_value_6 = true;
    				textfield6_changes.value = /*fields*/ ctx[0].confirmPassword;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			textfield6.$set(textfield6_changes);
    			const button_changes = {};
    			if (dirty & /*load*/ 2) button_changes.disabled = /*load*/ ctx[1];

    			if (dirty & /*$$scope, load*/ 4098) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fareguser.$$.fragment, local);
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(textfield2.$$.fragment, local);
    			transition_in(textfield3.$$.fragment, local);
    			transition_in(textfield4.$$.fragment, local);
    			transition_in(textfield5.$$.fragment, local);
    			transition_in(textfield6.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fareguser.$$.fragment, local);
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(textfield2.$$.fragment, local);
    			transition_out(textfield3.$$.fragment, local);
    			transition_out(textfield4.$$.fragment, local);
    			transition_out(textfield5.$$.fragment, local);
    			transition_out(textfield6.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(fareguser);
    			destroy_component(textfield0);
    			destroy_component(textfield1);
    			destroy_component(textfield2);
    			destroy_component(textfield3);
    			destroy_component(textfield4);
    			destroy_component(textfield5);
    			destroy_component(textfield6);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Registration', slots, []);
    	defaultModules.set(PNotifyMobile, {});

    	function myErrorAlert(errorMsg) {
    		error({ text: errorMsg });
    	}

    	let fields = {
    		firstName: "",
    		lastName: "",
    		address: "",
    		phone: "",
    		username: "",
    		password: "",
    		confirmPassword: ""
    	};

    	let valid = false;
    	let load = false;

    	const submitHandler = async () => {
    		valid = true;
    		$$invalidate(1, load = true);

    		if (fields.firstName.trim().length < 1) {
    			valid = false;
    			myErrorAlert('First Name must not be empty');
    			return;
    		}

    		if (fields.lastName.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Last Name must not be empty');
    			return;
    		}

    		if (fields.address.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Address must not be empty');
    			return;
    		}

    		if (fields.phone.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Phone Number must not be empty');
    			return;
    		}

    		if (fields.username.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Email must not be empty');
    			return;
    		}

    		if (fields.password.trim().length < 1) {
    			valid = false;
    			myErrorAlert('password must not be empty');
    			return;
    		}

    		if (fields.confirmPassword.trim().length < 1) {
    			valid = false;
    			myErrorAlert('Confirm Password must not be empty');
    			return;
    		}

    		if (fields.password != fields.confirmPassword) {
    			valid = false;
    			myErrorAlert('password and confirm password does not match');
    			return;
    		}

    		if (valid) {
    			console.log(valid);
    			console.log(fields);

    			try {
    				const data = fields;

    				const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/register', {
    					method: 'POST',
    					headers: {
    						'Accept': 'application/json',
    						'Content-Type': 'application/json'
    					},
    					body: JSON.stringify(data)
    				});

    				const content = await rawResponse.json(data);
    				console.log(content);

    				if (content.success == true) {
    					myErrorAlert('Registration sucessfull!!');
    					$$invalidate(1, load = false);
    				} else {
    					myErrorAlert('A user with the given username is already registered');
    					$$invalidate(1, load = false);
    				}
    			} catch(error) {
    				myErrorAlert(error);
    				$$invalidate(1, load = false);
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Registration> was created with unknown prop '${key}'`);
    	});

    	function textfield0_value_binding(value) {
    		if ($$self.$$.not_equal(fields.firstName, value)) {
    			fields.firstName = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield1_value_binding(value) {
    		if ($$self.$$.not_equal(fields.lastName, value)) {
    			fields.lastName = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield2_value_binding(value) {
    		if ($$self.$$.not_equal(fields.address, value)) {
    			fields.address = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield3_value_binding(value) {
    		if ($$self.$$.not_equal(fields.phone, value)) {
    			fields.phone = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield4_value_binding(value) {
    		if ($$self.$$.not_equal(fields.username, value)) {
    			fields.username = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield5_value_binding(value) {
    		if ($$self.$$.not_equal(fields.password, value)) {
    			fields.password = value;
    			$$invalidate(0, fields);
    		}
    	}

    	function textfield6_value_binding(value) {
    		if ($$self.$$.not_equal(fields.confirmPassword, value)) {
    			fields.confirmPassword = value;
    			$$invalidate(0, fields);
    		}
    	}

    	$$self.$capture_state = () => ({
    		FaRegUser,
    		TextField,
    		Button,
    		Icon,
    		FacebookLoader,
    		alert,
    		notice,
    		info,
    		success,
    		error,
    		defaultModules,
    		PNotifyMobile,
    		myErrorAlert,
    		fields,
    		valid,
    		load,
    		submitHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
    		if ('valid' in $$props) valid = $$props.valid;
    		if ('load' in $$props) $$invalidate(1, load = $$props.load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fields,
    		load,
    		submitHandler,
    		textfield0_value_binding,
    		textfield1_value_binding,
    		textfield2_value_binding,
    		textfield3_value_binding,
    		textfield4_value_binding,
    		textfield5_value_binding,
    		textfield6_value_binding
    	];
    }

    class Registration extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Registration",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Map.svelte generated by Svelte v3.44.3 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/Map.svelte";

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "full-screen svelte-dhn4br");
    			add_location(div, file$2, 36, 0, 687);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[3](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let center;
    	let $rLocationTime;
    	let $rLocation;
    	validate_store(rLocationTime, 'rLocationTime');
    	component_subscribe($$self, rLocationTime, $$value => $$invalidate(1, $rLocationTime = $$value));
    	validate_store(rLocation, 'rLocation');
    	component_subscribe($$self, rLocation, $$value => $$invalidate(2, $rLocation = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	let container;
    	let map;
    	let zoom = 15;

    	beforeUpdate(async () => {
    		await tick();
    		map = new google.maps.Map(container, { zoom, center }); //    styles: mapStyles // optional

    		new google.maps.Marker({
    				position: center,
    				title: $rLocationTime,
    				map
    			});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$capture_state = () => ({
    		rLocation,
    		rLocationTime,
    		tick,
    		beforeUpdate,
    		container,
    		map,
    		zoom,
    		center,
    		$rLocationTime,
    		$rLocation
    	});

    	$$self.$inject_state = $$props => {
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('map' in $$props) map = $$props.map;
    		if ('zoom' in $$props) zoom = $$props.zoom;
    		if ('center' in $$props) center = $$props.center;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$rLocation, $rLocationTime*/ 6) {
    			console.log($rLocation, $rLocationTime);
    		}

    		if ($$self.$$.dirty & /*$rLocation*/ 4) {
    			center = $rLocation;
    		}
    	};

    	return [container, $rLocationTime, $rLocation, div_binding];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/VehicleDetails.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/VehicleDetails.svelte";

    // (109:4) { #if ready }
    function create_if_block(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let button;
    	let current;

    	let info_1 = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		blocks: [,,,]
    	};

    	handle_promise(rLocation && rLocationTime, info_1);

    	button = new Button({
    			props: {
    				color: "primary",
    				dark: true,
    				block: true,
    				disabled: /*load*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*handleDelete*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			info_1.block.c();
    			t = space();
    			div0 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "btn svelte-wdi5y7");
    			add_location(div0, file$1, 117, 2, 2987);
    			attr_dev(div1, "class", "sec svelte-wdi5y7");
    			add_location(div1, file$1, 109, 1, 2859);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			info_1.block.m(div1, info_1.anchor = null);
    			info_1.mount = () => div1;
    			info_1.anchor = t;
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(button, div0, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};
    			if (dirty & /*load*/ 2) button_changes.disabled = /*load*/ ctx[1];

    			if (dirty & /*$$scope, load*/ 8194) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info_1.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			info_1.block.d();
    			info_1.token = null;
    			info_1 = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(109:4) { #if ready }",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>  import Header from "./Header.svelte";  import SpinnerLoader from "../shared/loader/SpinnerLoader.svelte";     import Map from "../Map.svelte";     import {Button,Icon}
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>  import Header from \\\"./Header.svelte\\\";  import SpinnerLoader from \\\"../shared/loader/SpinnerLoader.svelte\\\";     import Map from \\\"../Map.svelte\\\";     import {Button,Icon}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:then}
    function create_then_block(ctx) {
    	let map;
    	let current;
    	map = new Map$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(map.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(map, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(map, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(113:2) {:then}",
    		ctx
    	});

    	return block;
    }

    // (111:37)     <div>Hellohhhhshdhd</div>   {:then}
    function create_pending_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Hellohhhhshdhd";
    			add_location(div, file$1, 111, 3, 2918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(111:37)     <div>Hellohhhhshdhd</div>   {:then}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DELETE VEHICLE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(125:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (121:4) {#if load}
    function create_if_block_1(ctx) {
    	let div;
    	let facebookloader;
    	let current;
    	facebookloader = new FacebookLoader({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(facebookloader.$$.fragment);
    			attr_dev(div, "class", "loader svelte-wdi5y7");
    			add_location(div, file$1, 121, 4, 3105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(facebookloader, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(facebookloader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(facebookloader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(facebookloader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(121:4) {#if load}",
    		ctx
    	});

    	return block;
    }

    // (120:3) <Button color="primary" dark block disabled={load}  on:click={handleDelete}>
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*load*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(120:3) <Button color=\\\"primary\\\" dark block disabled={load}  on:click={handleDelete}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let div;
    	let header;
    	let t1;
    	let current;
    	header = new Header({ $$inline: true });
    	let if_block = /*ready*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			div = element("div");
    			create_component(header.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			script.defer = true;
    			script.async = true;
    			if (!src_url_equal(script.src, script_src_value = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD8W_n9m3E2j2CvAp6iOO0R_tVFFTdnS40&callback=initMap")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$1, 101, 1, 2651);
    			attr_dev(div, "class", "main svelte-wdi5y7");
    			add_location(div, file$1, 106, 0, 2807);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(header, div, null);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*ready*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*ready*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $user;
    	let $vehicleStore;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(7, $user = $$value));
    	validate_store(vehicleStore, 'vehicleStore');
    	component_subscribe($$self, vehicleStore, $$value => $$invalidate(4, $vehicleStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VehicleDetails', slots, []);
    	defaultModules.set(PNotifyMobile, {});

    	function myErrorAlert(errorMsg) {
    		error({ text: errorMsg });
    	}

    	let load = false;
    	let { active } = $$props;
    	let { ready } = $$props;
    	let location;
    	let locationTime;
    	Pusher.logToConsole = true;
    	var pusher = new Pusher('9468633eaae788047980', { cluster: 'mt1' });
    	var channel = pusher.subscribe('my-channel');

    	channel.bind('my-event', function (data) {
    		//   console.log(data);
    		location.lat = parseFloat(data.location.lat);

    		location.lng = parseFloat(data.location.lng);
    		locationTime = new Date(data.locationTime).toDateString();
    		rLocation.set(location);
    		rLocationTime.set(locationTime);
    		console.log(locationTime, location);
    	});

    	// console.log($vehicleStore)
    	// const logUser = $user
    	let vehicleLocalStore = JSON.parse(localStorage.getItem('vehicle'));

    	try {
    		if (vehicleLocalStore.location == null) {
    			location = { lat: 1, lng: 1 };
    			locationTime = "Time 0";
    		} else {
    			location = vehicleLocalStore.location;
    			location.lat = parseFloat(location.lat);
    			location.lng = parseFloat(location.lng);
    			locationTime = new Date(vehicleLocalStore.locationTime).toDateString();
    		}
    	} catch(error) {
    		console.log(error);
    	}

    	// $: rLocation = location
    	// $: rLocationTime = locationTime
    	rLocation.set(location);

    	rLocationTime.set(locationTime);
    	let activeHome = active;

    	const handleDelete = async () => {
    		$$invalidate(1, load = true);

    		try {
    			const data = {
    				vehicleId: $vehicleStore.vehicleId,
    				username: $user.username
    			};

    			console.log(data);

    			const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/remove-vehicle', {
    				method: 'PUT',
    				headers: {
    					'Accept': 'application/json',
    					'Content-Type': 'application/json'
    				},
    				body: JSON.stringify(data)
    			});

    			const content = await rawResponse.json(data);

    			// console.log(content)
    			if (content.success == true) {
    				user.set(content.user);
    				page.redirect('/dashboard');
    			}
    		} catch(error) {
    			console.log(error);
    			myErrorAlert(error);
    			$$invalidate(1, load = false);
    		}
    	};

    	const writable_props = ['active', 'ready'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<VehicleDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    		if ('ready' in $$props) $$invalidate(0, ready = $$props.ready);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		SpinnerLoader,
    		Map: Map$1,
    		Button,
    		Icon,
    		FacebookLoader,
    		router: page,
    		vehicleStore,
    		user,
    		rLocation,
    		rLocationTime,
    		alert,
    		notice,
    		info,
    		success,
    		error,
    		defaultModules,
    		PNotifyMobile,
    		myErrorAlert,
    		load,
    		active,
    		ready,
    		location,
    		locationTime,
    		pusher,
    		channel,
    		vehicleLocalStore,
    		activeHome,
    		handleDelete,
    		$user,
    		$vehicleStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('load' in $$props) $$invalidate(1, load = $$props.load);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    		if ('ready' in $$props) $$invalidate(0, ready = $$props.ready);
    		if ('location' in $$props) location = $$props.location;
    		if ('locationTime' in $$props) locationTime = $$props.locationTime;
    		if ('pusher' in $$props) pusher = $$props.pusher;
    		if ('channel' in $$props) channel = $$props.channel;
    		if ('vehicleLocalStore' in $$props) $$invalidate(11, vehicleLocalStore = $$props.vehicleLocalStore);
    		if ('activeHome' in $$props) activeHome = $$props.activeHome;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$vehicleStore*/ 16) {
    			console.log(vehicleLocalStore, $vehicleStore);
    		}
    	};

    	return [ready, load, handleDelete, active, $vehicleStore];
    }

    class VehicleDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { active: 3, ready: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VehicleDetails",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*active*/ ctx[3] === undefined && !('active' in props)) {
    			console_1.warn("<VehicleDetails> was created without expected prop 'active'");
    		}

    		if (/*ready*/ ctx[0] === undefined && !('ready' in props)) {
    			console_1.warn("<VehicleDetails> was created without expected prop 'ready'");
    		}
    	}

    	get active() {
    		throw new Error("<VehicleDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<VehicleDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ready() {
    		throw new Error("<VehicleDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ready(value) {
    		throw new Error("<VehicleDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.3 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let switch_instance;
    	let current;
    	var switch_value = /*page*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: { ready: /*ready*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(main, file, 65, 0, 1352);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*ready*/ 1) switch_instance_changes.ready = /*ready*/ ctx[0];

    			if (switch_value !== (switch_value = /*page*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, main, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { ready } = $$props;
    	Pusher.logToConsole = true;
    	let page$1;
    	page('/', () => $$invalidate(1, page$1 = Registration));

    	page('/dashboard', () => {
    		if (localStorage.getItem('user') == null) {
    			page.redirect('/login');
    		}

    		$$invalidate(1, page$1 = Home);
    	});

    	page('/login', () => {
    		localStorage.removeItem('user');
    		localStorage.removeItem('vehicle');
    		$$invalidate(1, page$1 = LoginPgae);
    	});

    	page('/add-vehicle', () => {
    		if (localStorage.getItem('user') == null) {
    			page.redirect('/login');
    		}

    		$$invalidate(1, page$1 = AddVehicle);
    	});

    	page('/staff-profile', () => {
    		if (localStorage.getItem('user') == null) {
    			page.redirect('/login');
    		}

    		$$invalidate(1, page$1 = StaffProfile);
    	});

    	page('/map', () => $$invalidate(1, page$1 = MapPage));

    	page('/vehicle-detail', () => {
    		if (localStorage.getItem('user') == null) {
    			page.redirect('/login');
    		}

    		$$invalidate(1, page$1 = VehicleDetails);
    	});

    	let active = true;
    	page.start();
    	const writable_props = ['ready'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ready' in $$props) $$invalidate(0, ready = $$props.ready);
    	};

    	$$self.$capture_state = () => ({
    		router: page,
    		Home,
    		LoginPage: LoginPgae,
    		AddVehicle,
    		StaffProfile,
    		Registration,
    		user,
    		Map: Map$1,
    		VehicleDetails,
    		ready,
    		page: page$1,
    		active
    	});

    	$$self.$inject_state = $$props => {
    		if ('ready' in $$props) $$invalidate(0, ready = $$props.ready);
    		if ('page' in $$props) $$invalidate(1, page$1 = $$props.page);
    		if ('active' in $$props) active = $$props.active;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ready, page$1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { ready: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ready*/ ctx[0] === undefined && !('ready' in props)) {
    			console.warn("<App> was created without expected prop 'ready'");
    		}
    	}

    	get ready() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ready(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		ready: false,
    	}
    });

    window.initMap = function ready() {
    	app.$set({ ready: true });
    };

    return app;

})();
//# sourceMappingURL=bundle.js.map
